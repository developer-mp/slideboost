import indexedDBService from '../../utils/storage/indexDb';

class WebSocketService {
  private ws: WebSocket | null = null;
  private isConnected: boolean = false;
  private currentFile: {
    name: string;
    size: number;
    mimeType: string;
    timestamp: string;
    path: string;
  } | null = null;
  private fileChunks: Uint8Array[] = [];
  private expectedChunks: number = 0;
  private receivedChunks: number = 0;
  private callbacks: {
    onConnect?: () => void;
    onDisconnect?: () => void;
    onFileStart?: (fileInfo: any) => void;
    onFileProgress?: (progress: number) => void;
    onFileComplete?: (videoId: string, fileName: string) => void;
    onError?: (error: string) => void;
  } = {};

  constructor() {
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  setCallbacks(callbacks: {
    onConnect?: () => void;
    onDisconnect?: () => void;
    onFileStart?: (fileInfo: any) => void;
    onFileProgress?: (progress: number) => void;
    onFileComplete?: (videoId: string, fileName: string) => void;
    onError?: (error: string) => void;
  }) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        if (this.ws && this.isConnected) {
          console.log('WebSocket already connected');
          resolve(true);
          return;
        }

        const wsUrl = 'ws://localhost:3003';
        console.log('Using WebSocket URL:', wsUrl);
        
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('✅ WebSocket connected successfully');
          this.isConnected = true;
          this.callbacks.onConnect?.();
          resolve(true);
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event);
        };

        this.ws.onclose = (event) => {
          console.log('🔌 WebSocket connection closed:', event.code, event.reason);
          this.isConnected = false;
          this.callbacks.onDisconnect?.();
          
          let closeReason = 'Connection closed';
          switch (event.code) {
            case 1000:
              closeReason = 'Normal closure';
              break;
            case 1001:
              closeReason = 'Endpoint going away';
              break;
            case 1002:
              closeReason = 'Protocol error';
              break;
            case 1003:
              closeReason = 'Unsupported data type';
              break;
            case 1006:
              closeReason = 'Connection lost (server may be down)';
              break;
            case 1011:
              closeReason = 'Server error';
              break;
            default:
              closeReason = `Connection closed (code: ${event.code})`;
          }
          
          if (event.code !== 1000 && this.callbacks.onError) {
            this.callbacks.onError(closeReason);
          }
        };

        this.ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          this.isConnected = false;
          
          let errorMessage = 'WebSocket connection failed';
          
          if (error.type === 'error') {
            errorMessage = 'Cannot connect to server. Please ensure:\n' +
                          '1. Server is running (node launcher.js)\n' +
                          '2. Port 3003 is available\n' +
                          '3. No firewall blocking connection';
          }
          
          this.callbacks.onError?.(errorMessage);
          reject(new Error(errorMessage));
        };

        const connectionTimeout = setTimeout(() => {
          if (!this.isConnected) {
            console.error('❌ WebSocket connection timeout');
            if (this.ws) {
              this.ws.close();
            }
            reject(new Error('Connection timeout - server may not be running'));
          }
        }, 5000);

        this.ws.onopen = () => {
          clearTimeout(connectionTimeout);
          console.log('✅ WebSocket connected successfully');
          this.isConnected = true;
          this.callbacks.onConnect?.();
          resolve(true);
        };

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        this.callbacks.onError?.('Failed to create WebSocket connection');
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.ws) {
      console.log('🔌 Disconnecting WebSocket...');
      this.isConnected = false;
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
      this.resetFileState();
    }
  }

  private handleMessage(event: MessageEvent) {
    if (typeof event.data === 'string') {
      try {
        const data = JSON.parse(event.data);
        console.log('📩 Received message:', data.type);

        switch (data.type) {
          case 'connection-ready':
            console.log('🔗 Server ready for video transfer');
            break;

          case 'video-file-start':
            console.log('📹 Starting video file reception:', data.fileName);
            this.startFileReception(data);
            break;

          case 'video-file-chunk':
            console.log(`📦 Receiving chunk ${data.chunkIndex + 1}/${data.totalChunks}`);
            this.expectedChunks = data.totalChunks;
            break;

          case 'video-file-complete':
            console.log('✅ Video file transfer completed:', data.fileName);
            this.completeFileReception(data);
            break;

          case 'video-file-error':
            console.error('❌ Video file transfer error:', data.error);
            this.handleTransferError(data);
            break;

          case 'closing-app':
            console.log('🔚 Server is closing the app:', data.message);
            setTimeout(() => {
              this.disconnect();
            }, 1000);
            break;

          case 'test-message':
            console.log('🧪 Test message from server:', data.message);
            break;

          default:
            console.log('📨 Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
        this.callbacks.onError?.('Error parsing server message');
      }
    } 
    else if (event.data instanceof Blob || event.data instanceof ArrayBuffer) {
      console.log('📦 Received binary chunk, size:', event.data.size || event.data.byteLength);
      this.handleFileChunk(event.data);
    }
  }

  private startFileReception(metadata: any) {
    this.currentFile = {
      name: metadata.fileName,
      size: metadata.fileSize,
      mimeType: metadata.mimeType,
      timestamp: metadata.timestamp,
      path: metadata.filePath
    };
    
    this.fileChunks = [];
    this.receivedChunks = 0;
    this.expectedChunks = 0;
    
    console.log(`📥 Preparing to receive: ${metadata.fileName} (${(metadata.fileSize / (1024 * 1024)).toFixed(2)} MB)`);
    
    this.callbacks.onFileStart?.(this.currentFile);
  }

  private async handleFileChunk(chunkData: Blob | ArrayBuffer) {
    try {
      let arrayBuffer: ArrayBuffer;
      if (chunkData instanceof Blob) {
        arrayBuffer = await chunkData.arrayBuffer();
      } else {
        arrayBuffer = chunkData;
      }
      
      this.fileChunks.push(new Uint8Array(arrayBuffer));
      this.receivedChunks++;
      
      console.log(`📦 Chunk ${this.receivedChunks}/${this.expectedChunks} received`);
      
      if (this.expectedChunks > 0) {
        const progress = Math.round((this.receivedChunks / this.expectedChunks) * 100);
        this.callbacks.onFileProgress?.(progress);
        
        if (this.expectedChunks > 10 && this.receivedChunks % Math.ceil(this.expectedChunks / 10) === 0) {
          console.log(`📈 Download progress: ${progress}%`);
        }
      }
      
    } catch (error) {
      console.error('Error handling file chunk:', error);
      this.callbacks.onError?.('Error processing file chunk');
    }
  }
  private async completeFileReception(completionData: any) {
    try {
      if (this.receivedChunks !== completionData.totalChunks) {
        console.warn(`⚠️ Chunk count mismatch: received ${this.receivedChunks}, expected ${completionData.totalChunks}`);
      }
      
      const totalSize = this.fileChunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const completeFile = new Uint8Array(totalSize);
      
      let offset = 0;
      for (const chunk of this.fileChunks) {
        completeFile.set(chunk, offset);
        offset += chunk.length;
      }
      
      console.log(`✅ File assembled: ${completeFile.length} bytes`);
      
      const fileBlob = new Blob([completeFile], { type: this.currentFile?.mimeType });

      console.log(`📥 File received: `, fileBlob);
      
      const videoId = await this.saveVideoToIndexedDB(fileBlob, this.currentFile?.name || 'video_file');
      
      this.callbacks.onFileComplete?.(videoId, this.currentFile?.name || 'video_file');
      
      this.confirmVideoReceived(completionData);
      
    } catch (error) {
      console.error('Error completing file reception:', error);
      this.callbacks.onError?.('Failed to assemble received file');
      this.sendErrorToServer('Failed to assemble received file');
    }
  }

  private async saveVideoToIndexedDB(fileBlob: Blob, fileName: string): Promise<string> {
    try {
      const videoId = await indexedDBService.saveVideo(
        fileName,
        fileBlob,
        this.currentFile?.mimeType || 'video/mp4'
      );
      console.log(`💾 Video saved to IndexedDB: ${fileName} (ID: ${videoId})`);
      return videoId;
    } catch (error) {
      console.error('Error saving video to IndexedDB:', error);
      this.callbacks.onError?.('Error saving video to database');
      throw error;
    }
  }

  private confirmVideoReceived(completionData: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const confirmation = {
        type: 'video-received',
        message: 'Video file received and saved successfully',
        fileName: completionData.fileName,
        fileSize: completionData.totalSize,
        timestamp: new Date().toISOString(),
        success: true
      };
      
      console.log('📤 Sending video received confirmation to server');
      this.ws.send(JSON.stringify(confirmation));
    } else {
      console.error('Cannot send confirmation - WebSocket not connected');
    }
  }

  private sendErrorToServer(errorMessage: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const errorData = {
        type: 'video-error',
        message: errorMessage,
        fileName: this.currentFile?.name || 'unknown',
        timestamp: new Date().toISOString()
      };
      
      console.log('📤 Sending error notification to server');
      this.ws.send(JSON.stringify(errorData));
    }
  }

  private handleTransferError(errorData: any) {
    console.error('Transfer error received from server:', errorData);
    this.callbacks.onError?.(`Transfer error: ${errorData.error}`);
    this.resetFileState();
  }

  private resetFileState() {
    this.currentFile = null;
    this.fileChunks = [];
    this.receivedChunks = 0;
    this.expectedChunks = 0;
  }

  requestAppClose(reason = 'User requested close') {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const closeRequest = {
        type: 'close-app',
        message: reason,
        timestamp: new Date().toISOString()
      };
      
      console.log('📤 Requesting app close');
      this.ws.send(JSON.stringify(closeRequest));
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: this.ws?.readyState,
      currentFile: this.currentFile
    };
  }
}

const webSocketService = new WebSocketService();

export default webSocketService;