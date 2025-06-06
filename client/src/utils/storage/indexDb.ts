interface VideoFile {
    id: string;
    fileName: string;
    fileBlob: Blob;
    mimeType: string;
    size: number;
    timestamp: string;
    url?: string;
  }
  
  class IndexedDBService {
    private dbName = 'VideoStorage';
    private dbVersion = 1;
    private storeName = 'videos';
    private db: IDBDatabase | null = null;
  
    constructor() {
      this.init();
    }
  
    private async init(): Promise<void> {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion);
  
        request.onerror = () => {
          console.error('Failed to open IndexedDB:', request.error);
          reject(request.error);
        };
  
        request.onsuccess = () => {
          this.db = request.result;
          console.log('✅ IndexedDB initialized successfully');
          resolve();
        };
  
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          if (!db.objectStoreNames.contains(this.storeName)) {
            const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
            store.createIndex('fileName', 'fileName', { unique: false });
            store.createIndex('timestamp', 'timestamp', { unique: false });
            console.log('📁 Created IndexedDB object store for videos');
          }
        };
      });
    }
  
    async saveVideo(fileName: string, fileBlob: Blob, mimeType: string): Promise<string> {
      if (!this.db) {
        await this.init();
      }
  
      return new Promise((resolve, reject) => {
        if (!this.db) {
          reject(new Error('IndexedDB not initialized'));
          return;
        }
  
        const id = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const videoFile: VideoFile = {
          id,
          fileName,
          fileBlob,
          mimeType,
          size: fileBlob.size,
          timestamp: new Date().toISOString()
        };
  
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.add(videoFile);
  
        request.onsuccess = () => {
          console.log(`💾 Video saved to IndexedDB: ${fileName} (ID: ${id})`);
          resolve(id);
        };
  
        request.onerror = () => {
          console.error('Failed to save video to IndexedDB:', request.error);
          reject(request.error);
        };
      });
    }
  
    async getAllVideos(): Promise<VideoFile[]> {
      if (!this.db) {
        await this.init();
      }
  
      return new Promise((resolve, reject) => {
        if (!this.db) {
          reject(new Error('IndexedDB not initialized'));
          return;
        }
  
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();
  
        request.onsuccess = () => {
          const videos = request.result.map(video => ({
            ...video,
          }));
          resolve(videos);
        };
  
        request.onerror = () => {
          console.error('Failed to get videos from IndexedDB:', request.error);
          reject(request.error);
        };
      });
    }
  
    async getVideo(id: string): Promise<VideoFile | null> {
      if (!this.db) {
        await this.init();
      }
  
      return new Promise((resolve, reject) => {
        if (!this.db) {
          reject(new Error('IndexedDB not initialized'));
          return;
        }
  
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(id);
  
        request.onsuccess = () => {
          const video = request.result;
          resolve(video || null);
        };
  
        request.onerror = () => {
          console.error('Failed to get video from IndexedDB:', request.error);
          reject(request.error);
        };
      });
    }
  
    async deleteVideo(id: string): Promise<void> {
      if (!this.db) {
        await this.init();
      }
  
      return new Promise((resolve, reject) => {
        if (!this.db) {
          reject(new Error('IndexedDB not initialized'));
          return;
        }
  
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(id);
  
        request.onsuccess = () => {
          console.log(`🗑️ Video deleted from IndexedDB: ${id}`);
          resolve();
        };
  
        request.onerror = () => {
          console.error('Failed to delete video from IndexedDB:', request.error);
          reject(request.error);
        };
      });
    }
  
    async clearAllVideos(): Promise<void> {
      if (!this.db) {
        await this.init();
      }
  
      return new Promise((resolve, reject) => {
        if (!this.db) {
          reject(new Error('IndexedDB not initialized'));
          return;
        }
  
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.clear();
  
        request.onsuccess = () => {
          console.log('🧹 All videos cleared from IndexedDB');
          resolve();
        };
  
        request.onerror = () => {
          console.error('Failed to clear videos from IndexedDB:', request.error);
          reject(request.error);
        };
      });
    }
  
    async getStorageInfo(): Promise<{ count: number; totalSize: number }> {
      const videos = await this.getAllVideos();
      const count = videos.length;
      const totalSize = videos.reduce((sum, video) => sum + video.size, 0);
      
      return { count, totalSize };
    }
  
    createVideoURL(video: VideoFile): string {
      return URL.createObjectURL(video.fileBlob);
    }
  
    revokeVideoURL(url: string): void {
      URL.revokeObjectURL(url);
    }
  }
  
  const indexedDBService = new IndexedDBService();
  
  export default indexedDBService;
  export type { VideoFile };