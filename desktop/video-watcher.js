const fs = require('fs-extra');
const path = require('path');
const chokidar = require('chokidar');
const { findLatestVideoFile } = require('./video-finder');

class VideoWatcher {
  constructor() {
    this.watcher = null;
    this.watchPaths = [];
    this.callbacks = [];
    this.latestVideo = null;
    this.isWatching = false;
    this.appLaunchTime = new Date();
    this.websocket = null;
    this.isUploading = false;
    this.appClosing = false;
    this.watchedFolders = new Set(); // Track folders we're already watching
    console.log('VideoWatcher initialized at:', this.appLaunchTime);
  }

  // Register a callback for new video notifications
  registerCallback(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
      return true;
    }
    return false;
  }

  // Remove a callback
  removeCallback(callback) {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }

  // Set websocket connection
  setWebsocket(ws) {
    console.log('🔌 Setting WebSocket connection:', ws ? 'Connected' : 'Disconnected');
    this.websocket = ws;
    
    if (ws) {
      console.log('✅ WebSocket readyState:', ws.readyState);
      console.log('✅ WebSocket connection established for VideoWatcher');
      
      // If we have a latest video that was detected before WebSocket was available, try to send it now
      if (this.latestVideo && new Date(this.latestVideo.mtime) > this.appLaunchTime) {
        console.log('📤 WebSocket now available, sending previously detected video...');
        setTimeout(() => {
          this.sendVideoViaWebSocket(this.latestVideo).catch(err => {
            console.error('Failed to send previously detected video:', err);
          });
        }, 1000); // Small delay to ensure connection is fully ready
      }
    }
  }

  // Send video file via WebSocket with proper chunking and zero-byte protection
  async sendVideoViaWebSocket(file) {
    if (this.isUploading) {
      console.log('Upload already in progress, skipping...');
      return { success: false, message: 'Upload already in progress' };
    }

    // Check WebSocket connection with more detailed logging
    console.log('🔍 Checking WebSocket connection...');
    console.log('WebSocket exists:', !!this.websocket);
    
    if (this.websocket) {
      console.log('WebSocket readyState:', this.websocket.readyState);
      console.log('WebSocket states: CONNECTING=0, OPEN=1, CLOSING=2, CLOSED=3');
    }

    if (!this.websocket) {
      console.error('❌ No WebSocket connection available');
      return { success: false, message: 'No WebSocket connection available' };
    }
    
    if (this.websocket.readyState !== 1) { // 1 = WebSocket.OPEN
      console.error(`❌ WebSocket connection not ready. State: ${this.websocket.readyState}`);
      
      // Try to wait for connection to be ready
      console.log('⏳ Waiting for WebSocket to be ready...');
      let attempts = 0;
      const maxAttempts = 10;
      
      while (this.websocket.readyState !== 1 && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
        console.log(`⏳ Attempt ${attempts}/${maxAttempts}, WebSocket state: ${this.websocket.readyState}`);
      }
      
      if (this.websocket.readyState !== 1) {
        console.error('❌ WebSocket connection still not ready after waiting');
        return { success: false, message: 'WebSocket connection not ready after waiting' };
      }
    }

    this.isUploading = true;
    
    try {
      console.log('📤 Sending video file via WebSocket:', file.path);
      
      // Final file validation before reading
      if (!fs.existsSync(file.path)) {
        console.error('❌ File does not exist at send time:', file.path);
        return { success: false, message: 'File does not exist' };
      }
      
      const preReadStats = fs.statSync(file.path);
      if (preReadStats.size === 0) {
        console.error('❌ File has zero bytes at send time:', file.path);
        return { success: false, message: 'File has zero bytes' };
      }
      
      if (preReadStats.size < 1024) { // Less than 1KB
        console.error('❌ File too small to be a valid video:', preReadStats.size, 'bytes');
        return { success: false, message: `File too small: ${preReadStats.size} bytes` };
      }
      
      console.log(`📊 Pre-read validation passed. Size: ${(preReadStats.size / (1024 * 1024)).toFixed(2)} MB`);
      
      // Read the file with error handling
      let fileBuffer;
      try {
        fileBuffer = await fs.readFile(file.path);
      } catch (readError) {
        console.error('❌ Error reading file:', readError);
        return { success: false, message: `Error reading file: ${readError.message}` };
      }
      
      if (!fileBuffer || fileBuffer.length === 0) {
        console.error('❌ File buffer is empty after reading');
        return { success: false, message: 'File buffer is empty' };
      }
      
      const fileName = path.basename(file.path);
      
      console.log(`📊 File successfully read - Name: ${fileName}, Buffer size: ${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB`);
      
      // Send file metadata first
      const metadata = {
        type: 'video-file-start',
        fileName: fileName,
        fileSize: fileBuffer.length,
        mimeType: this.getMimeType(file.path),
        timestamp: new Date().toISOString(),
        filePath: file.path
      };
      
      console.log('📋 Sending file metadata...');
      this.websocket.send(JSON.stringify(metadata));
      
      // Wait a moment for the client to prepare
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Send the file in chunks to avoid WebSocket message size limits
      const chunkSize = 64 * 1024; // 64KB chunks
      const totalChunks = Math.ceil(fileBuffer.length / chunkSize);
      
      console.log(`📦 Sending file in ${totalChunks} chunks of ${chunkSize} bytes each`);
      
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, fileBuffer.length);
        const chunk = fileBuffer.slice(start, end);
        
        if (chunk.length === 0) {
          console.error(`❌ Empty chunk detected at index ${i}`);
          throw new Error(`Empty chunk at index ${i}`);
        }
        
        // Send chunk metadata
        const chunkInfo = {
          type: 'video-file-chunk',
          chunkIndex: i,
          totalChunks: totalChunks,
          chunkSize: chunk.length,
          fileName: fileName
        };
        
        this.websocket.send(JSON.stringify(chunkInfo));
        
        // Send the actual chunk data
        this.websocket.send(chunk);
        
        // Small delay between chunks to prevent overwhelming
        if (i < totalChunks - 1) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        
        // Log progress for large files
        if (totalChunks > 10 && i % Math.ceil(totalChunks / 10) === 0) {
          console.log(`📈 Progress: ${Math.round((i / totalChunks) * 100)}%`);
        }
      }
      
      // Send completion message
      const completionMessage = {
        type: 'video-file-complete',
        fileName: fileName,
        totalSize: fileBuffer.length,
        totalChunks: totalChunks,
        timestamp: new Date().toISOString(),
        message: 'Video file transfer completed'
      };
      
      console.log('✅ Sending completion message...');
      this.websocket.send(JSON.stringify(completionMessage));
      
      console.log('✅ Video file sent successfully via WebSocket');
      
      return { 
        success: true, 
        message: 'Video file sent successfully',
        fileName: fileName,
        fileSize: fileBuffer.length,
        totalChunks: totalChunks
      };
      
    } catch (error) {
      console.error('❌ Error sending video file via WebSocket:', error);
      
      // Send error message to client if possible
      if (this.websocket && this.websocket.readyState === 1) {
        try {
          this.websocket.send(JSON.stringify({
            type: 'video-file-error',
            error: error.message,
            fileName: file.name || 'unknown',
            timestamp: new Date().toISOString()
          }));
        } catch (sendError) {
          console.error('Failed to send error message to client:', sendError);
        }
      }
      
      return { success: false, message: error.message };
    } finally {
      this.isUploading = false;
    }
  }
  
  // Helper method to determine MIME type based on file extension
  getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.mkv': 'video/x-matroska',
      '.wmv': 'video/x-ms-wmv',
      '.flv': 'video/x-flv',
      '.webm': 'video/webm',
      '.m4v': 'video/x-m4v',
      '.mpg': 'video/mpeg',
      '.mpeg': 'video/mpeg'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  // Helper method to check if a folder name looks like a Zoom meeting folder
  isZoomMeetingFolder(folderName) {
    // Pattern: YYYY-MM-DD HH.MM.SS [Meeting Name]
    const zoomFolderPattern = /^\d{4}-\d{2}-\d{2}\s+\d{1,2}\.\d{2}\.\d{2}\s+.*$/;
    return zoomFolderPattern.test(folderName);
  }

  // Find the latest Zoom meeting folder
  findLatestZoomMeetingFolder(basePath) {
    try {
      if (!fs.existsSync(basePath)) {
        return null;
      }

      const items = fs.readdirSync(basePath, { withFileTypes: true });
      const meetingFolders = items
        .filter(item => item.isDirectory() && this.isZoomMeetingFolder(item.name))
        .map(folder => {
          const folderPath = path.join(basePath, folder.name);
          const stats = fs.statSync(folderPath);
          return {
            name: folder.name,
            path: folderPath,
            mtime: stats.mtime
          };
        })
        .sort((a, b) => b.mtime - a.mtime); // Sort by modification time, newest first

      console.log(`Found ${meetingFolders.length} Zoom meeting folders in ${basePath}`);
      
      if (meetingFolders.length > 0) {
        console.log('Latest meeting folder:', meetingFolders[0].name);
        return meetingFolders[0];
      }

      return null;
    } catch (error) {
      console.error('Error finding latest Zoom meeting folder:', error);
      return null;
    }
  }

  // Watch for new meeting folders in the base Zoom directory
  watchForNewMeetingFolders(basePath) {
    console.log('👀 Setting up watcher for new meeting folders in:', basePath);
    
    const folderWatcher = chokidar.watch(basePath, {
      ignored: /(^|[\/\\])\.|\.git|node_modules|\~\$/,
      persistent: true,
      ignoreInitial: false, // We want to see existing folders too
      depth: 1, // Only watch direct subdirectories
      usePolling: true,
      interval: 2000,
      binaryInterval: 2000
    });

    folderWatcher
      .on('addDir', (dirPath) => {
        if (dirPath === basePath) return; // Skip the base directory itself
        
        const folderName = path.basename(dirPath);
        console.log('📁 Directory detected:', folderName);
        
        if (this.isZoomMeetingFolder(folderName)) {
          console.log('🎯 New Zoom meeting folder detected:', folderName);
          this.watchMeetingFolder(dirPath);
        }
      })
      .on('error', error => console.error('Folder watcher error:', error));

    return folderWatcher;
  }

  // Watch a specific meeting folder for video files
  watchMeetingFolder(meetingFolderPath) {
    if (this.watchedFolders.has(meetingFolderPath)) {
      console.log('📂 Already watching meeting folder:', meetingFolderPath);
      return;
    }

    console.log('📹 Setting up video watcher for meeting folder:', meetingFolderPath);
    this.watchedFolders.add(meetingFolderPath);

    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv', '.webm', '.m4v', '.mpg', '.mpeg'];
    
    // Create patterns for video files in this specific folder
    const videoPatterns = videoExtensions.map(ext => path.join(meetingFolderPath, `*${ext}`));
    
    console.log('📹 Adding video patterns for meeting folder:', videoPatterns);
    
    if (this.watcher) {
      this.watcher.add(videoPatterns);
    }

    // Also check for existing videos in this folder
    this.checkForVideosInFolder(meetingFolderPath);
  }

  // Check for existing videos in a specific folder
  async checkForVideosInFolder(folderPath) {
    try {
      console.log('🔍 Checking for existing videos in:', folderPath);
      
      if (!fs.existsSync(folderPath)) {
        return;
      }

      const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv', '.webm', '.m4v', '.mpg', '.mpeg'];
      const files = fs.readdirSync(folderPath);
      
      const videoFiles = files
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return videoExtensions.includes(ext);
        })
        .map(file => {
          const filePath = path.join(folderPath, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            path: filePath,
            size: stats.size,
            mtime: stats.mtime
          };
        })
        .sort((a, b) => b.mtime - a.mtime); // Newest first

      if (videoFiles.length > 0) {
        console.log(`📹 Found ${videoFiles.length} video(s) in meeting folder`);
        const latestVideo = videoFiles[0];
        
        // Only process if it's newer than our current latest video and created after app launch
        if (new Date(latestVideo.mtime) > this.appLaunchTime &&
            (!this.latestVideo || new Date(latestVideo.mtime) > new Date(this.latestVideo.mtime))) {
          console.log('✨ Found newer video in meeting folder:', latestVideo.name);
          this.handleNewFile(latestVideo.path);
        }
      }
    } catch (error) {
      console.error('Error checking for videos in folder:', error);
    }
  }

  // Initialize the watcher with default or custom paths
  initialize(customFolders = null) {
    console.log('Initializing video watcher with nested folder support...');
    this.stopWatching();

    if (customFolders && Array.isArray(customFolders) && customFolders.length > 0) {
      this.watchPaths = customFolders;
    } else {
      const os = require('os');
      const home = os.homedir();

      this.watchPaths = [
        path.join(home, 'Documents', 'Zoom'),
        path.join(home, 'AppData', 'Roaming', 'Zoom', 'data'),
        '/tmp/zoom_recordings',
        path.join(home, '.zoom'),
      ];

      console.log('Base watching directories:', this.watchPaths);
    }

    this.watchPaths = this.watchPaths.filter(folderPath => {
      try {
        return fs.existsSync(folderPath);
      } catch (error) {
        return false;
      }
    });

    if (this.watchPaths.length === 0) {
      console.log('No valid paths to watch');
      return false;
    }

    this.latestVideo = findLatestVideoFile();
    return this.startWatching();
  }

  // Start the watcher
  startWatching() {
    try {
      console.log('🚀 Starting enhanced watcher on paths:', this.watchPaths);

      const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv', '.webm', '.m4v', '.mpg', '.mpeg'];
      
      // First, set up watchers for new meeting folders in each base path
      this.watchPaths.forEach(basePath => {
        // Watch for new meeting folders
        this.watchForNewMeetingFolders(basePath);
        
        // Find and watch existing meeting folders
        const latestMeetingFolder = this.findLatestZoomMeetingFolder(basePath);
        if (latestMeetingFolder) {
          console.log('📂 Found latest meeting folder:', latestMeetingFolder.name);
          this.watchMeetingFolder(latestMeetingFolder.path);
        }
        
        // Also look for other existing meeting folders
        try {
          const items = fs.readdirSync(basePath, { withFileTypes: true });
          const meetingFolders = items
            .filter(item => item.isDirectory() && this.isZoomMeetingFolder(item.name))
            .map(folder => path.join(basePath, folder.name));
          
          meetingFolders.forEach(folderPath => {
            this.watchMeetingFolder(folderPath);
          });
        } catch (error) {
          console.error('Error scanning for existing meeting folders:', error);
        }
      });

      // Set up the main file watcher
      this.watcher = chokidar.watch([], { // Start with empty array, we'll add paths dynamically
        ignored: /(^|[\/\\])\.|\.git|node_modules|\~\$|Library\/Containers/,
        persistent: true,
        ignoreInitial: true,
        depth: 3,
        usePolling: true,
        interval: 1000,
        binaryInterval: 1000,
        awaitWriteFinish: {
          stabilityThreshold: 2000,
          pollInterval: 100
        },
        disableGlobbing: false,
        followSymlinks: false
      });

      // Add video file patterns for the base directories (legacy support)
      const videoPatterns = [];
      this.watchPaths.forEach(folderPath => {
        videoExtensions.forEach(ext => {
          videoPatterns.push(path.join(folderPath, `**/*${ext}`));
        });
      });
      
      console.log('📹 Adding base video file patterns:', videoPatterns);
      this.watcher.add(videoPatterns);

      this.watcher
        .on('add', filePath => {
          console.log('📁 File added:', filePath);
          const ext = path.extname(filePath).toLowerCase();
          if (videoExtensions.includes(ext)) {
            this.handleNewFile(filePath);
          }
        })
        .on('change', filePath => {
          console.log('📝 File changed:', filePath);
          const ext = path.extname(filePath).toLowerCase();
          if (videoExtensions.includes(ext)) {
            this.handleFileChange(filePath);
          }
        })
        .on('unlink', filePath => {
          const ext = path.extname(filePath).toLowerCase();
          if (videoExtensions.includes(ext)) {
            console.log('🗑️ Video file removed:', filePath);
          }
        })
        .on('error', error => console.error('Watcher error:', error))
        .on('ready', () => {
          console.log('✅ Initial scan complete. Now watching for changes...');
          this.isWatching = true;
          this.checkForLatestVideo();
        });

      return true;
    } catch (error) {
      console.error('Error starting watcher:', error);
      return false;
    }
  }

  // Stop watching and clean up
  stopWatching() {
    if (this.watcher) {
      console.log('🛑 Stopping watcher...');
      try {
        this.watcher.close().then(() => {
          console.log('✅ Watcher stopped successfully');
        }).catch(err => {
          console.error('❌ Error stopping watcher:', err);
        });
      } catch (error) {
        console.error('❌ Error in watcher cleanup:', error);
      } finally {
        this.watcher = null;
        this.isWatching = false;
        this.watchedFolders.clear();
      }
      return true;
    }
    return false;
  }

  // Check for the latest video in all watched directories
  async checkForLatestVideo() {
    try {
      console.log('🔍 Checking for latest video in watched directories...');
      const latest = await findLatestVideoFile();
      if (latest) {
        console.log('📹 Latest video found:', latest.path);
        if (!this.latestVideo || new Date(latest.mtime) > new Date(this.latestVideo.mtime)) {
          this.latestVideo = latest;
          this.notifyCallbacks(latest);
        }
      }
    } catch (error) {
      console.error('❌ Error checking for latest video:', error);
    }
  }

  // Handle new file events with enhanced zero-byte protection
  async handleNewFile(filePath, retryCount = 0) {
    try {
      console.log('🎬 New video file detected:', filePath, retryCount > 0 ? `(retry ${retryCount})` : '');

      if (!fs.existsSync(filePath)) {
        console.log('❌ File no longer exists:', filePath);
        return;
      }

      const stats = fs.statSync(filePath);
      const maxRetries = 6; // Maximum 6 retries (30 seconds total wait)
      const retryDelay = 5000; // 5 seconds between retries
      
      console.log(`📊 File size check: ${stats.size} bytes`);
      
      if (stats.size === 0) {
        if (retryCount < maxRetries) {
          console.log(`⏳ File has zero size (attempt ${retryCount + 1}/${maxRetries}), waiting ${retryDelay/1000} seconds...`);
          setTimeout(() => {
            this.handleNewFile(filePath, retryCount + 1);
          }, retryDelay);
          return;
        } else {
          console.log('❌ File still has zero size after maximum retries, skipping:', filePath);
          return;
        }
      }

      // Additional check: ensure file size is reasonable (at least 1KB for video files)
      const minFileSize = 1024; // 1KB minimum
      if (stats.size < minFileSize) {
        if (retryCount < maxRetries) {
          console.log(`⚠️ File size too small (${stats.size} bytes), waiting for more content (attempt ${retryCount + 1}/${maxRetries})...`);
          setTimeout(() => {
            this.handleNewFile(filePath, retryCount + 1);
          }, retryDelay);
          return;
        } else {
          console.log(`❌ File size still too small (${stats.size} bytes) after maximum retries, skipping:`, filePath);
          return;
        }
      }

      const newVideo = {
        name: path.basename(filePath),
        path: filePath,
        size: stats.size,
        mtime: stats.mtime
      };

      console.log('📹 New video details:', {
        name: newVideo.name,
        size: (newVideo.size / (1024 * 1024)).toFixed(2) + ' MB',
        mtime: newVideo.mtime,
        folder: path.dirname(filePath),
        retryCount: retryCount
      });

      // Check if this video was created after app launch
      if (new Date(newVideo.mtime) > this.appLaunchTime) {
        console.log('✅ Video created after app launch, processing...');
        
        if (!this.latestVideo || new Date(newVideo.mtime) > new Date(this.latestVideo.mtime || 0)) {
          console.log('📤 New video is the latest, preparing to send...');
          this.latestVideo = newVideo;
          this.notifyCallbacks(newVideo);
          
          // Check if WebSocket is available before trying to send
          if (!this.websocket) {
            console.log('⏳ WebSocket not yet available, will send when connected');
            return;
          }
          
          if (this.websocket.readyState !== 1) {
            console.log('⏳ WebSocket not ready, will retry when ready');
            return;
          }
          
          // Wait for file stabilization with progressive monitoring
          console.log('⏳ Monitoring file stability before sending...');
          const stableVideo = await this.waitForFileStability(filePath, newVideo);
          
          if (!stableVideo) {
            console.log('❌ File did not stabilize properly, skipping send');
            return;
          }
          
          // Update latest video with stable data
          this.latestVideo = stableVideo;
          
          // Send the video via WebSocket
          console.log('🚀 Sending stable video via WebSocket...');
          const result = await this.sendVideoViaWebSocket(stableVideo);
          
          if (result.success) {
            console.log('✅ Video sent successfully, waiting for client confirmation...');
          } else {
            console.error('❌ Failed to send video:', result.message);
          }
        }
      } else {
        console.log('📅 Video predates app launch, skipping...');
      }
    } catch (error) {
      console.error('❌ Error processing new video file:', error);
      
      // If it's a file access error and we haven't retried too much, try again
      if (retryCount < 3 && (error.code === 'ENOENT' || error.code === 'EBUSY' || error.code === 'EPERM')) {
        console.log(`🔄 File access error, retrying in 3 seconds... (${error.code})`);
        setTimeout(() => {
          this.handleNewFile(filePath, retryCount + 1);
        }, 3000);
      }
    }
  }

  // New method to wait for file stability with progressive monitoring
  async waitForFileStability(filePath, initialVideo) {
    try {
      console.log('📊 Starting file stability monitoring...');
      
      let previousSize = initialVideo.size;
      let stableCount = 0;
      const requiredStableChecks = 3; // Need 3 consecutive stable checks
      const checkInterval = 1000; // Check every 1 second
      const maxWaitTime = 30000; // Maximum 30 seconds wait
      const startTime = Date.now();
      
      while (Date.now() - startTime < maxWaitTime) {
        // Wait before checking
        await new Promise(resolve => setTimeout(resolve, checkInterval));
        
        // Check if file still exists
        if (!fs.existsSync(filePath)) {
          console.log('❌ File disappeared during stability check');
          return null;
        }
        
        const currentStats = fs.statSync(filePath);
        const currentSize = currentStats.size;
        
        console.log(`📏 Size check: ${(currentSize / (1024 * 1024)).toFixed(2)} MB (previous: ${(previousSize / (1024 * 1024)).toFixed(2)} MB)`);
        
        if (currentSize === 0) {
          console.log('❌ File became zero bytes during stability check');
          return null;
        }
        
        if (currentSize === previousSize) {
          stableCount++;
          console.log(`✓ File size stable (${stableCount}/${requiredStableChecks})`);
          
          if (stableCount >= requiredStableChecks) {
            console.log('✅ File is stable and ready for transmission');
            return {
              name: path.basename(filePath),
              path: filePath,
              size: currentSize,
              mtime: currentStats.mtime
            };
          }
        } else {
          stableCount = 0; // Reset stable count if size changed
          console.log('📈 File size changed, resetting stability counter');
        }
        
        previousSize = currentSize;
      }
      
      console.log('⏰ Maximum wait time exceeded, proceeding with current file state');
      
      // Final check
      if (fs.existsSync(filePath)) {
        const finalStats = fs.statSync(filePath);
        if (finalStats.size > 0) {
          return {
            name: path.basename(filePath),
            path: filePath,
            size: finalStats.size,
            mtime: finalStats.mtime
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error during file stability monitoring:', error);
      return null;
    }
  }

  // Handle file change events
  handleFileChange(filePath) {
    try {
      console.log('📝 Video file changed:', filePath);

      if (!fs.existsSync(filePath)) {
        console.log('❌ File no longer exists:', filePath);
        return;
      }

      const stats = fs.statSync(filePath);
      if (stats.size > 0) {
        const updatedVideo = {
          name: path.basename(filePath),
          path: filePath,
          size: stats.size,
          mtime: stats.mtime
        };

        console.log('📹 Updated video details:', {
          name: updatedVideo.name,
          size: (updatedVideo.size / (1024 * 1024)).toFixed(2) + ' MB',
          mtime: updatedVideo.mtime
        });

        if ((this.latestVideo && this.latestVideo.path === filePath) || 
            !this.latestVideo || 
            new Date(updatedVideo.mtime) > new Date(this.latestVideo.mtime || 0)) {
          console.log('✅ Updated video is the latest:', filePath);
          this.latestVideo = updatedVideo;
          this.notifyCallbacks(updatedVideo);
        }
      } else {
        console.log('⏳ Video file has zero size after change, waiting for it to be written:', filePath);
      }
    } catch (error) {
      console.error('❌ Error processing changed video file:', error);
    }
  }

  // Register a callback to be notified when a new video is found
  onNewVideo(callback) {
    if (typeof callback !== 'function') {
      console.error('❌ Invalid callback provided to onNewVideo');
      return false;
    }

    if (this.callbacks.includes(callback)) {
      console.log('⚠️ Callback already registered');
      return true;
    }

    this.callbacks.push(callback);
    console.log(`✅ Added new video callback. Total callbacks: ${this.callbacks.length}`);

    if (this.latestVideo) {
      console.log('📤 Notifying new callback with existing latest video:', this.latestVideo.name);
      try {
        callback({...this.latestVideo});
      } catch (error) {
        console.error('❌ Error in initial callback:', error);
      }
    }

    return () => this.removeCallback(callback);
  }

  // Notify all registered callbacks of a new video
  notifyCallbacks(videoData) {
    if (!videoData) return;

    console.log('📢 Notifying callbacks about video:', videoData.name);

    const videoCopy = { ...videoData };

    if (videoCopy.mtime && !(videoCopy.mtime instanceof Date)) {
      videoCopy.mtime = new Date(videoCopy.mtime);
    }

    this.latestVideo = videoCopy;

    this.callbacks.forEach(cb => {
      try {
        if (typeof cb === 'function') {
          cb(videoCopy);
        }
      } catch (error) {
        console.error('❌ Error in video callback:', error);
      }
    });
  }

  // Get the current latest video
  getLatestVideo() {
    return this.latestVideo ? {...this.latestVideo} : null;
  }

  // Add a new folder to watch
  addFolder(folderPath) {
    if (!folderPath || !fs.existsSync(folderPath)) {
      console.log('❌ Invalid folder path:', folderPath);
      return false;
    }

    if (this.watchPaths.includes(folderPath)) {
      console.log('⚠️ Already watching folder:', folderPath);
      return true;
    }

    this.watchPaths.push(folderPath);

    if (this.watcher) {
      console.log('📁 Adding folder to watcher:', folderPath);
      
      // Check if this is a base Zoom folder or a meeting folder
      if (this.isZoomMeetingFolder(path.basename(folderPath))) {
        this.watchMeetingFolder(folderPath);
      } else {
        // Watch for meeting folders in this base directory
        this.watchForNewMeetingFolders(folderPath);
        
        // Also add video patterns for legacy support
        const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv', '.webm', '.m4v', '.mpg', '.mpeg'];
        const videoPatterns = videoExtensions.map(ext => path.join(folderPath, `**/*${ext}`));
        
        console.log('📹 Adding video patterns for new folder:', videoPatterns);
        this.watcher.add(videoPatterns);
      }
    }

    return true;
  }

  // Debug method to test WebSocket connection
  testWebSocketConnection() {
    console.log('🔍 Testing WebSocket connection...');
    console.log('WebSocket exists:', !!this.websocket);
    
    if (this.websocket) {
      console.log('WebSocket readyState:', this.websocket.readyState);
      console.log('WebSocket URL:', this.websocket.url || 'No URL available');
      
      try {
        this.websocket.send(JSON.stringify({
          type: 'test-message',
          message: 'Testing WebSocket connection from VideoWatcher',
          timestamp: new Date().toISOString()
        }));
        console.log('✅ Test message sent successfully');
        return true;
      } catch (error) {
        console.error('❌ Failed to send test message:', error);
        return false;
      }
    } else {
      console.log('❌ No WebSocket connection available');
      return false;
    }
  }

  // Get status information about the watcher
  getStatus() {
    return {
      isWatching: this.isWatching,
      watchPaths: this.watchPaths,
      watchedFolders: Array.from(this.watchedFolders),
      latestVideo: this.latestVideo,
      callbackCount: this.callbacks.length,
      hasWebSocket: !!this.websocket,
      isUploading: this.isUploading
    };
  }
}

// Create and export a singleton instance
const videoWatcher = new VideoWatcher();

module.exports = videoWatcher;