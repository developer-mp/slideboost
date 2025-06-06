// Simplified launcher with WebSocket file handling and npm-script-based stopping
const WebSocket = require('ws');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const videoWatcher = require('./video-watcher');

// Try to create WebSocket server
let wss;
try {
  wss = new WebSocket.Server({ 
    port: 3003,
    host: 'localhost'
  });
  console.log('✅ WebSocket server created successfully');
} catch (error) {
  console.error('❌ Failed to create WebSocket server:', error);
  process.exit(1);
}

// Test if port is actually listening
wss.on('listening', () => {
  console.log('🎯 WebSocket server is LISTENING on ws://localhost:3003');
  console.log('🔗 Ready for connections!');
});

wss.on('error', (error) => {
  console.error('❌ WebSocket server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.log('💡 Port 3003 is already in use. Kill existing process:');
    console.log('   Windows: netstat -ano | findstr :3003, then taskkill /PID <PID> /F');
    console.log('   Mac/Linux: lsof -ti:3003 | xargs kill -9');
  }
});

let electronProcess = null;
let currentWebSocket = null;
let isUploadingFile = false;

// Helper method to determine MIME type based on file extension
function getMimeType(filePath) {
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

// Send video file via WebSocket with proper chunking
async function sendVideoViaWebSocket(ws, file) {
  if (isUploadingFile) {
    console.log('📤 Upload already in progress, skipping...');
    return { success: false, message: 'Upload already in progress' };
  }

  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.error('❌ WebSocket connection not available for file transfer');
    return { success: false, message: 'WebSocket connection not available' };
  }

  isUploadingFile = true;
  
  try {
    console.log('📤 Sending video file via WebSocket:', file.path);
    
    // Read the file
    const fileBuffer = await fs.readFile(file.path);
    const fileName = path.basename(file.path);
    
    console.log(`📊 File details: ${fileName}, Size: ${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB`);
    
    // Send file metadata first
    const metadata = {
      type: 'video-file-start',
      fileName: fileName,
      fileSize: fileBuffer.length,
      mimeType: getMimeType(file.path),
      timestamp: new Date().toISOString(),
      filePath: file.path
    };
    
    console.log('📋 Sending file metadata...');
    ws.send(JSON.stringify(metadata));
    
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
      
      // Send chunk metadata
      const chunkInfo = {
        type: 'video-file-chunk',
        chunkIndex: i,
        totalChunks: totalChunks,
        chunkSize: chunk.length,
        fileName: fileName
      };
      
      ws.send(JSON.stringify(chunkInfo));
      
      // Send the actual chunk data
      ws.send(chunk);
      
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
    ws.send(JSON.stringify(completionMessage));
    
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
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({
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
    isUploadingFile = false;
  }
}

// Function to close Electron app using npm scripts and spawn
async function closeElectronApp(websocket) {
  console.log('🛑 Closing Electron application using npm scripts...');
  
  // Send final message to client before closing
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    try {
      websocket.send(JSON.stringify({
        type: 'electron-closing',
        message: 'Electron app closing via npm script, server will remain running',
        timestamp: new Date().toISOString()
      }));
      console.log('✅ Final message sent to client');
      
    } catch (error) {
      console.error('❌ Error sending final message:', error);
    }
  }
  
  // Stop video watcher
  videoWatcher.stopWatching();
  
  // Use npm scripts with spawn to close Electron
  if (electronProcess && !electronProcess.killed) {
    try {
      console.log('🛑 Attempting to close Electron using npm scripts...');
      const electronPID = electronProcess.pid;
      
      // Method 1: Try graceful termination first
      electronProcess.kill('SIGTERM');
      
      // Wait for graceful shutdown
      const gracefulClose = await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.log('⚠️ Graceful shutdown timeout, trying npm stop script...');
          resolve(false);
        }, 2000);
        
        electronProcess.on('close', () => {
          console.log('✅ Electron process closed gracefully');
          clearTimeout(timeout);
          resolve(true);
        });
        
        electronProcess.on('exit', () => {
          console.log('✅ Electron process exited gracefully');
          clearTimeout(timeout);
          resolve(true);
        });
      });
      
      // Method 2: If graceful failed, use platform-specific npm scripts
      if (!gracefulClose) {
        console.log('🔧 Using platform-specific npm script to stop Electron...');
        
        await new Promise((resolve) => {
          let stopProcess;
          
          if (process.platform === 'win32') {
            // Use Windows-specific stop script
            stopProcess = spawn('npm', ['run', 'stop-win'], {
              cwd: __dirname,
              stdio: 'pipe',
              shell: true
            });
          } else {
            // Use Unix/Linux/Mac-specific stop script  
            stopProcess = spawn('npm', ['run', 'stop-unix'], {
              cwd: __dirname,
              stdio: 'pipe',
              shell: true
            });
          }
          
          let output = '';
          
          stopProcess.stdout.on('data', (data) => {
            output += data.toString();
            console.log(`📋 npm stop output: ${data.toString().trim()}`);
          });
          
          stopProcess.stderr.on('data', (data) => {
            console.log(`📋 npm stop stderr: ${data.toString().trim()}`);
          });
          
          stopProcess.on('close', (code) => {
            console.log(`✅ npm stop process completed with code: ${code}`);
            resolve();
          });
          
          stopProcess.on('error', (error) => {
            console.error('❌ npm stop process error:', error);
            resolve();
          });
          
          // Timeout for npm stop
          setTimeout(() => {
            if (stopProcess && !stopProcess.killed) {
              stopProcess.kill('SIGKILL');
              console.log('⏰ npm stop process timed out');
            }
            resolve();
          }, 5000);
        });
      }
      
      // Method 3: If npm scripts failed, use direct spawn commands
      if (electronProcess && !electronProcess.killed) {
        console.log('🔫 npm scripts failed, using direct spawn kill commands...');
        
        await new Promise((resolve) => {
          let killProcess;
          
          if (process.platform === 'win32') {
            killProcess = spawn('taskkill', ['/PID', electronPID.toString(), '/T', '/F'], {
              stdio: 'pipe',
              shell: true
            });
          } else {
            killProcess = spawn('kill', ['-9', electronPID.toString()], {
              stdio: 'pipe'
            });
          }
          
          killProcess.on('close', (code) => {
            if (code === 0) {
              console.log('💥 Electron process terminated via direct spawn command');
            } else {
              console.log(`⚠️ Direct kill process exited with code: ${code}`);
            }
            resolve();
          });
          
          killProcess.on('error', (error) => {
            console.error('❌ Direct spawn kill failed:', error);
            resolve();
          });
          
          setTimeout(() => {
            resolve();
          }, 3000);
        });
      }
      
      electronProcess = null;
      
    } catch (error) {
      console.error('❌ Error in spawn-based termination:', error);
      electronProcess = null;
    }
  }
  
  // Close the WebSocket connection after Electron is closed
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.close(1000, 'electron-closed');
    setTimeout(() => {
      console.log('✅ WebSocket connection closed, server still running');
    }, 500);
  }
  
  // Reset current WebSocket reference
  if (currentWebSocket === websocket) {
    currentWebSocket = null;
  }
  
  console.log('✅ Electron app closed via spawn method, server ready for new connections');
}

// Connection handler
wss.on('connection', (ws, req) => {
  console.log('🔗 NEW CONNECTION from:', req.socket.remoteAddress);
  currentWebSocket = ws;
  
  // Handle messages from the client
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('📩 Received message:', data.type);
      
      // Handle video received confirmation
      if (data.type === 'video-received') {
        console.log('✅ Client confirmed video received:', data.message);
        
        // Send confirmation back to client
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'closing-app',
            message: 'Video confirmed received, closing Electron app via npm scripts',
            timestamp: new Date().toISOString()
          }));
        }
        
        // Close Electron app after a short delay (keep server running)
        setTimeout(() => {
          closeElectronApp(ws);
        }, 1000);
      }
      
      // Handle close-app message (fallback)
      if (data.type === 'close-app') {
        console.log('🔚 Received close-app request:', data.message);
        closeElectronApp(ws);
      }
      
    } catch (error) {
      console.error('❌ Error processing message:', error);
    }
  });
  
  // Create a callback for handling video detection from VideoWatcher
  const videoCallback = function(videoData) {
    console.log('📹 Video detected from VideoWatcher:', videoData.name);
    console.log('📊 Video details:', {
      name: videoData.name,
      size: (videoData.size / (1024 * 1024)).toFixed(2) + ' MB',
      path: videoData.path
    });
    
    // Send the video file via WebSocket
    if (currentWebSocket && currentWebSocket.readyState === WebSocket.OPEN) {
      console.log('🚀 Sending video file via WebSocket...');
      sendVideoViaWebSocket(currentWebSocket, videoData)
        .then(result => {
          if (result.success) {
            console.log('✅ Video sent successfully, waiting for client confirmation...');
          } else {
            console.error('❌ Failed to send video:', result.message);
          }
        })
        .catch(error => {
          console.error('❌ Error in video sending process:', error);
        });
    } else {
      console.error('❌ No active WebSocket connection to send video');
    }
  };
  
  // Register the callback with VideoWatcher
  videoWatcher.registerCallback(videoCallback);
  
  // Initialize video watcher if not already initialized
  if (!videoWatcher.isWatching) {
    console.log('🎬 Initializing video watcher...');
    videoWatcher.initialize();
  }

  // Send immediate confirmation
  try {
    ws.send(JSON.stringify({
      type: 'connection-ready',
      message: 'Connection established, ready to receive videos',
      timestamp: new Date().toISOString(),
      serverInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        workingDir: __dirname
      }
    }));
    
    console.log('✅ Connection ready message sent to client');
    
  } catch (error) {
    console.error('Error sending initial message:', error);
  }

  // Spawn Electron process
  try {
    electronProcess = spawn('npm', ['start'], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
      detached: false
    });

    console.log('✅ Electron process spawned with PID:', electronProcess.pid);
    
    // Handle stdout and stderr
    electronProcess.stdout.on('data', (data) => {
      console.log(`📱 Electron stdout: ${data.toString().trim()}`);
    });
    
    electronProcess.stderr.on('data', (data) => {
      console.error(`📱 Electron stderr: ${data.toString().trim()}`);
    });
    
  } catch (spawnError) {
    console.error('❌ Error spawning Electron process:', spawnError);
  }

  // Handle WebSocket events
  ws.on('close', (code, reason) => {
    console.log(`🔌 Connection closed with code: ${code}, reason: ${reason}`);
    videoWatcher.removeCallback(videoCallback);
    if (currentWebSocket === ws) {
      currentWebSocket = null;
    }
    console.log('🔄 Server ready for new connections...');
  });

  ws.on('error', (error) => {
    console.error('❌ Connection error:', error);
    videoWatcher.removeCallback(videoCallback);
    if (currentWebSocket === ws) {
      currentWebSocket = null;
    }
  });

  // Handle Electron process events
  electronProcess.on('close', (code, signal) => {
    console.log(`🔚 Electron process exited with code: ${code}, signal: ${signal}`);
    electronProcess = null;
    console.log('📱 Electron app closed, WebSocket server still running');
  });

  electronProcess.on('exit', (code, signal) => {
    console.log(`🚪 Electron process exit event - code: ${code}, signal: ${signal}`);
    electronProcess = null;
  });

  electronProcess.on('error', (error) => {
    console.error('❌ Electron process error:', error);
    electronProcess = null;
    console.log('⚠️ Electron app error, WebSocket server still running');
  });
});

// Keep process alive and show status
const statusInterval = setInterval(() => {
  const connections = wss.clients.size;
  console.log(`💓 Server alive, connections: ${connections}`);
  console.log(`📡 Current WebSocket available: ${currentWebSocket ? 'Yes' : 'No'}`);
  console.log(`📤 Upload in progress: ${isUploadingFile ? 'Yes' : 'No'}`);
  console.log(`📱 Electron process running: ${electronProcess && !electronProcess.killed ? 'Yes (PID: ' + electronProcess.pid + ')' : 'No'}`);
  
  // Show connection states
  wss.clients.forEach((client, index) => {
    const state = client.readyState === WebSocket.OPEN ? 'OPEN' : 
                  client.readyState === WebSocket.CLOSING ? 'CLOSING' : 
                  client.readyState === WebSocket.CLOSED ? 'CLOSED' : 'CONNECTING';
    console.log(`   Connection ${index + 1}: ${state}`);
  });
}, 30000);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  clearInterval(statusInterval);
  
  videoWatcher.stopWatching();
  
  if (electronProcess && !electronProcess.killed) {
    console.log('🛑 Terminating Electron process during shutdown...');
    electronProcess.kill('SIGTERM');
    
    // Force kill if it doesn't close in 2 seconds
    setTimeout(() => {
      if (electronProcess && !electronProcess.killed) {
        electronProcess.kill('SIGKILL');
      }
    }, 2000);
  }
  
  // Close WebSocket server
  wss.close(() => {
    console.log('✅ WebSocket server closed');
    process.exit(0);
  });
});

console.log('🎯 DEBUG SERVER READY - waiting for connections...');