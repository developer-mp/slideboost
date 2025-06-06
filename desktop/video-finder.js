const fs = require('fs-extra');
const path = require('path');
const os = require('os');

// Helper function to check if a folder name looks like a Zoom meeting folder
function isZoomMeetingFolder(folderName) {
  // Pattern: YYYY-MM-DD HH.MM.SS [Meeting Name]
  const zoomFolderPattern = /^\d{4}-\d{2}-\d{2}\s+\d{1,2}\.\d{2}\.\d{2}\s+.*$/;
  return zoomFolderPattern.test(folderName);
}

// Function to find videos in a specific meeting folder
function findVideosInMeetingFolder(meetingFolderPath) {
  try {
    console.log('🔍 Searching for videos in meeting folder:', meetingFolderPath);
    
    if (!fs.existsSync(meetingFolderPath)) {
      console.log('❌ Meeting folder does not exist:', meetingFolderPath);
      return [];
    }

    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv', '.webm', '.m4v', '.mpg', '.mpeg'];
    const files = fs.readdirSync(meetingFolderPath);

    const videoFiles = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return videoExtensions.includes(ext);
      })
      .map(file => {
        const filePath = path.join(meetingFolderPath, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          path: filePath,
          size: stats.size,
          mtime: stats.mtime,
          meetingFolder: path.basename(meetingFolderPath)
        };
      })
      .sort((a, b) => b.mtime - a.mtime); // Sort by modification time, newest first

    console.log(`📹 Found ${videoFiles.length} video(s) in meeting folder: ${path.basename(meetingFolderPath)}`);
    return videoFiles;
  } catch (error) {
    console.error('❌ Error searching meeting folder:', error);
    return [];
  }
}

// Function to find all Zoom meeting folders in a base directory
function findZoomMeetingFolders(basePath) {
  try {
    console.log('📁 Searching for Zoom meeting folders in:', basePath);
    
    if (!fs.existsSync(basePath)) {
      console.log('❌ Base path does not exist:', basePath);
      return [];
    }

    const items = fs.readdirSync(basePath, { withFileTypes: true });
    const meetingFolders = items
      .filter(item => item.isDirectory() && isZoomMeetingFolder(item.name))
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

    console.log(`📂 Found ${meetingFolders.length} Zoom meeting folders in: ${basePath}`);
    return meetingFolders;
  } catch (error) {
    console.error('❌ Error finding Zoom meeting folders:', error);
    return [];
  }
}

// Enhanced function to find the latest video file with nested folder support
function findLatestVideoFile(customFolder = null) {
  try {
    console.log('🚀 Starting enhanced video search...');
    
    // Specific locations for video files
    const possibleLocations = [
      path.join(os.homedir(), 'Documents', 'Zoom'),
      path.join(os.homedir(), 'AppData', 'Roaming', 'Zoom', 'data'), // Windows
      '/tmp/zoom_recordings', // Linux temporary location
      path.join(os.homedir(), '.zoom'), // Linux hidden folder
    ];
    
    // Explicitly exclude system directories
    const excludedPaths = [
      path.join(os.homedir(), 'Library'),
      path.join(os.homedir(), 'Library/Containers'),
      '/System',
      '/Library'
    ];

    // If a custom folder is provided, use it instead
    const foldersToCheck = customFolder ? [customFolder] : possibleLocations;
    
    // Filter out any paths that might be inside excluded directories
    const filteredFolders = foldersToCheck.filter(folder => {
      // Don't check custom folders against exclusion list
      if (customFolder && folder === customFolder) return true;
      
      // Check if this folder is inside any excluded path
      return !excludedPaths.some(excluded => 
        folder === excluded || folder.startsWith(excluded + path.sep)
      );
    });
    
    console.log('📁 Checking folders after exclusion filtering:', filteredFolders);
    
    let allVideoFiles = [];

    // Check each base folder
    for (const baseFolder of filteredFolders) {
      console.log('🔍 Processing base folder:', baseFolder);

      if (!fs.existsSync(baseFolder)) {
        console.log('❌ Base folder not found:', baseFolder);
        continue;
      }

      // Method 1: Look for videos directly in the base folder (legacy support)
      console.log('📹 Checking for direct videos in base folder...');
      const directVideos = findVideosInFolder(baseFolder);
      allVideoFiles = [...allVideoFiles, ...directVideos];

      // Method 2: Look for Zoom meeting folders and search videos inside them
      console.log('📂 Checking for Zoom meeting folders...');
      const meetingFolders = findZoomMeetingFolders(baseFolder);
      
      for (const meetingFolder of meetingFolders) {
        console.log(`🎯 Searching in meeting folder: ${meetingFolder.name}`);
        const meetingVideos = findVideosInMeetingFolder(meetingFolder.path);
        allVideoFiles = [...allVideoFiles, ...meetingVideos];
      }

      // Method 3: Deep search for any other video files (fallback)
      console.log('🔎 Performing deep search for other video files...');
      const deepVideos = findVideosRecursively(baseFolder, 3); // Limit depth to 3
      allVideoFiles = [...allVideoFiles, ...deepVideos];
    }

    if (allVideoFiles.length === 0) {
      console.log('❌ No video files found in any of the checked locations');
      return null;
    }

    // Remove duplicates based on file path
    const uniqueVideos = allVideoFiles.reduce((acc, video) => {
      if (!acc.find(v => v.path === video.path)) {
        acc.push(video);
      }
      return acc;
    }, []);

    console.log(`📊 Total unique videos found: ${uniqueVideos.length}`);

    // Sort by modification time (newest first)
    uniqueVideos.sort((a, b) => b.mtime - a.mtime);

    // Get the latest video file
    const latestVideo = uniqueVideos[0];

    console.log('🏆 Latest video file found:');
    console.log('📝 Name:', latestVideo.name);
    console.log('📍 Path:', latestVideo.path);
    console.log('📊 Size:', (latestVideo.size / (1024 * 1024)).toFixed(2), 'MB');
    console.log('📅 Last modified:', latestVideo.mtime);
    if (latestVideo.meetingFolder) {
      console.log('📂 Meeting folder:', latestVideo.meetingFolder);
    }

    return latestVideo;
  } catch (error) {
    console.error('❌ Error finding latest video file:', error);
    return null;
  }
}

// Function to find videos directly in a folder (non-recursive)
function findVideosInFolder(folderPath) {
  try {
    if (!fs.existsSync(folderPath)) {
      return [];
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
      });

    return videoFiles;
  } catch (error) {
    console.error('❌ Error finding videos in folder:', error);
    return [];
  }
}

// Function to recursively search for video files with depth limit
function findVideosRecursively(folderPath, maxDepth = 3, currentDepth = 0) {
  try {
    if (currentDepth >= maxDepth || !fs.existsSync(folderPath)) {
      return [];
    }

    let allVideos = [];
    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.wmv', '.flv', '.webm', '.m4v', '.mpg', '.mpeg'];

    const items = fs.readdirSync(folderPath, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(folderPath, item.name);

      // Skip hidden files and system directories
      if (item.name.startsWith('.') || 
          item.name === 'node_modules' || 
          item.name.includes('Library/Containers')) {
        continue;
      }

      if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        if (videoExtensions.includes(ext)) {
          const stats = fs.statSync(itemPath);
          allVideos.push({
            name: item.name,
            path: itemPath,
            size: stats.size,
            mtime: stats.mtime
          });
        }
      } else if (item.isDirectory()) {
        // Skip Zoom meeting folders as they're handled separately
        if (!isZoomMeetingFolder(item.name)) {
          const subVideos = findVideosRecursively(itemPath, maxDepth, currentDepth + 1);
          allVideos = [...allVideos, ...subVideos];
        }
      }
    }

    return allVideos;
  } catch (error) {
    console.error('❌ Error in recursive video search:', error);
    return [];
  }
}

// Function to find the latest video in a specific meeting folder
function findLatestVideoInMeetingFolder(meetingFolderPath) {
  const videos = findVideosInMeetingFolder(meetingFolderPath);
  return videos.length > 0 ? videos[0] : null; // Return the latest (first after sorting)
}

// Function to find the latest Zoom meeting folder with videos
function findLatestMeetingWithVideos(basePath) {
  try {
    console.log('🎯 Finding latest meeting folder with videos in:', basePath);
    
    const meetingFolders = findZoomMeetingFolders(basePath);
    
    for (const meetingFolder of meetingFolders) {
      const videos = findVideosInMeetingFolder(meetingFolder.path);
      if (videos.length > 0) {
        console.log(`✅ Found videos in meeting folder: ${meetingFolder.name}`);
        return {
          meetingFolder: meetingFolder,
          videos: videos,
          latestVideo: videos[0] // First video is the latest due to sorting
        };
      }
    }
    
    console.log('❌ No meeting folders with videos found');
    return null;
  } catch (error) {
    console.error('❌ Error finding latest meeting with videos:', error);
    return null;
  }
}

// Function to allow specifying a custom folder
function findLatestVideoInCustomFolder(folderPath) {
  return findLatestVideoFile(folderPath);
}

// Function to get all video files from all locations
function getAllVideoFiles(customFolder = null) {
  try {
    console.log('📊 Getting all video files...');
    
    const possibleLocations = customFolder ? [customFolder] : [
      path.join(os.homedir(), 'Documents', 'Zoom'),
      path.join(os.homedir(), 'AppData', 'Roaming', 'Zoom', 'data'),
      '/tmp/zoom_recordings',
      path.join(os.homedir(), '.zoom'),
    ];

    let allVideos = [];

    for (const baseFolder of possibleLocations) {
      if (!fs.existsSync(baseFolder)) continue;

      // Direct videos
      const directVideos = findVideosInFolder(baseFolder);
      allVideos = [...allVideos, ...directVideos];

      // Meeting folder videos
      const meetingFolders = findZoomMeetingFolders(baseFolder);
      for (const meetingFolder of meetingFolders) {
        const meetingVideos = findVideosInMeetingFolder(meetingFolder.path);
        allVideos = [...allVideos, ...meetingVideos];
      }

      // Deep search videos
      const deepVideos = findVideosRecursively(baseFolder, 3);
      allVideos = [...allVideos, ...deepVideos];
    }

    // Remove duplicates
    const uniqueVideos = allVideos.reduce((acc, video) => {
      if (!acc.find(v => v.path === video.path)) {
        acc.push(video);
      }
      return acc;
    }, []);

    // Sort by modification time (newest first)
    uniqueVideos.sort((a, b) => b.mtime - a.mtime);

    console.log(`📊 Total unique videos found: ${uniqueVideos.length}`);
    return uniqueVideos;
  } catch (error) {
    console.error('❌ Error getting all video files:', error);
    return [];
  }
}

// Main execution for testing
if (require.main === module) {
  console.log('🚀 Testing enhanced video finder...');
  
  const latestVideo = findLatestVideoFile();
  if (latestVideo) {
    console.log('\n🏆 Latest video details:');
    console.log('📝 Name:', latestVideo.name);
    console.log('📍 Path:', latestVideo.path);
    console.log('📊 Size:', (latestVideo.size / (1024 * 1024)).toFixed(2), 'MB');
    console.log('📅 Last modified:', latestVideo.mtime);
    if (latestVideo.meetingFolder) {
      console.log('📂 Meeting folder:', latestVideo.meetingFolder);
    }
  } else {
    console.log('❌ No video found or error occurred.');
  }
  
  // Test meeting folder functionality
  const testBasePath = path.join(os.homedir(), 'Documents', 'Zoom');
  if (fs.existsSync(testBasePath)) {
    console.log('\n📂 Testing meeting folder functionality...');
    const latestMeeting = findLatestMeetingWithVideos(testBasePath);
    if (latestMeeting) {
      console.log('✅ Latest meeting with videos:', latestMeeting.meetingFolder.name);
      console.log('📹 Videos in meeting:', latestMeeting.videos.length);
    }
  }
}

// Export functions for use in the Electron app
module.exports = {
  findLatestVideoFile,
  findLatestVideoInCustomFolder,
  findVideosInMeetingFolder,
  findZoomMeetingFolders,
  findLatestVideoInMeetingFolder,
  findLatestMeetingWithVideos,
  getAllVideoFiles,
  isZoomMeetingFolder
};