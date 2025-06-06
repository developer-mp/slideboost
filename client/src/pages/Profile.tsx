import { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Form, Alert, ProgressBar, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { getFirstChar } from "../utils/user/getFirstChar";
import { formatDate } from "./../utils/common/formatDate";
import { MdPersonOutline, MdOutlineCreditScore, MdCloudDownload, MdWifi, MdWifiOff, MdPlayArrow, MdDelete, MdStorage, MdDownload } from "react-icons/md";
import { createCheckout } from "../store/actions/paymentAction";
import { config } from "../../env.config";
import CreditsModal from "../components/widgets/CreditsModal";
import useCredits from "../utils/payment/useCredits";
import { getCreditBalance } from "../store/actions/userAction";
import { handleErrorMessage } from "../utils/common/handleActionMessage";
import { showErrorToast, showSuccessToast } from "../utils/common/handleToast";
import webSocketService from "../services/websocket/websocketService";
import indexedDBService, { VideoFile } from "../utils/storage/indexDb";
import VideoPlayerModal from "../components/main/videoplayer";

const Profile: React.FC = () => {
  const { userName, userId, createdAt, creditBalance } = useSelector(
    (state: RootState) => state.user
  );

  const initialCredits = 10;
  const pricePerCredit = Number(config.PRICE_PER_CREDIT);

  const {
    credits,
    setCredits,
    amount,
    showCreditsModal,
    handlePurchase,
    handleConfirmPurchase,
    closeCreditsModal,
  } = useCredits(initialCredits, pricePerCredit, userId);
  
  const [isWebSocketEnabled, setIsWebSocketEnabled] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [currentFile, setCurrentFile] = useState<{name: string, size: number} | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  
  const [savedVideos, setSavedVideos] = useState<VideoFile[]>([]);
  const [storageInfo, setStorageInfo] = useState<{count: number, totalSize: number}>({ count: 0, totalSize: 0 });
  
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);

  const [downloadingVideos, setDownloadingVideos] = useState<Set<string>>(new Set());

  const dispatch = useDispatch<AppDispatch>();

  const formattedCreatedAt = formatDate(createdAt, "MMM d, yyyy");
  const firstInitial = getFirstChar(userName);

  const onCheckout = async (amount: number, userId: string) => {
    return await dispatch(createCheckout({ amount, userId })).unwrap();
  };

  const handleConfirm = () => {
    handleConfirmPurchase(onCheckout);
  };

  const handleCreditBalance = useCallback(async () => {
    try {
      await dispatch(getCreditBalance({ userId })).unwrap();
    } catch (error) {
      const errorMessage = handleErrorMessage(error);
      showErrorToast(errorMessage);
      console.error(
        "Error occurred while retrieving the credit balance: ",
        error
      );
    }
  }, [dispatch, userId]);

  const loadSavedVideos = useCallback(async () => {
    try {
      const videos = await indexedDBService.getAllVideos();
      setSavedVideos(videos);
      
      const info = await indexedDBService.getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Error loading saved videos:', error);
      showErrorToast('Failed to load saved videos');
    }
  }, []);

  const handleDownloadVideo = async (video: VideoFile) => {
    try {
      setDownloadingVideos(prev => new Set(prev).add(video.id));
      
      const fullVideo = await indexedDBService.getVideo(video.id);
      
      if (!fullVideo || !fullVideo.fileBlob) {
        throw new Error('Video data not found');
      }

      const url = URL.createObjectURL(fullVideo.fileBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fullVideo.fileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      showSuccessToast(`Downloaded: ${video.fileName}`);
    } catch (error) {
      console.error('Error downloading video:', error);
      showErrorToast(`Failed to download ${video.fileName}`);
    } finally {
      setDownloadingVideos(prev => {
        const newSet = new Set(prev);
        newSet.delete(video.id);
        return newSet;
      });
    }
  };

  const handleDownloadAllVideos = async () => {
    if (savedVideos.length === 0) {
      showErrorToast('No videos to download');
      return;
    }

    try {
      for (const video of savedVideos) {
        await handleDownloadVideo(video);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      showSuccessToast(`Started downloading ${savedVideos.length} videos`);
    } catch (error) {
      console.error('Error downloading all videos:', error);
      showErrorToast('Failed to download all videos');
    }
  };

  const handleWebSocketToggle = async (checked: boolean) => {
    if (checked) {
      setConnectionStatus('connecting');
      setStatusMessage('Connecting to video server...');
      
      try {
        await webSocketService.connect();
        setIsWebSocketEnabled(true);
        setConnectionStatus('connected');
        setStatusMessage('Connected! Waiting for videos...');
        showSuccessToast('Connected to video server');
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        setIsWebSocketEnabled(false);
        setConnectionStatus('error');
        
        const errorMsg = error instanceof Error ? error.message : 'Unknown connection error';
        
        if (errorMsg.includes('timeout') || errorMsg.includes('server may not be running')) {
          setStatusMessage('Server not running. Please start the video server first.');
          showErrorToast('Server not running. Please start: node launcher.js');
        } else if (errorMsg.includes('Connection lost')) {
          setStatusMessage('Connection lost. Server may have stopped.');
          showErrorToast('Connection lost. Please restart the video server.');
        } else {
          setStatusMessage('Connection failed. Check server status.');
          showErrorToast('Failed to connect to video server');
        }
      }
    } else {
      webSocketService.disconnect();
      setIsWebSocketEnabled(false);
      setConnectionStatus('disconnected');
      setStatusMessage('');
      setCurrentFile(null);
      setDownloadProgress(0);
      showSuccessToast('Disconnected from video server');
    }
  };

  const handlePlayVideo = (video: VideoFile) => {
    setSelectedVideo(video);
    setShowVideoPlayer(true);
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      await indexedDBService.deleteVideo(videoId);
      await loadSavedVideos(); // Refresh the list
      showSuccessToast('Video deleted successfully');
    } catch (error) {
      console.error('Error deleting video:', error);
      showErrorToast('Failed to delete video');
    }
  };

  const handleClearAllVideos = async () => {
    if (window.confirm('Are you sure you want to delete all saved videos? This action cannot be undone.')) {
      try {
        await indexedDBService.clearAllVideos();
        await loadSavedVideos(); // Refresh the list
        showSuccessToast('All videos cleared successfully');
      } catch (error) {
        console.error('Error clearing videos:', error);
        showErrorToast('Failed to clear videos');
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    webSocketService.setCallbacks({
      onConnect: () => {
        setConnectionStatus('connected');
        setStatusMessage('Connected! Waiting for videos...');
      },
      onDisconnect: () => {
        setConnectionStatus('disconnected');
        setStatusMessage('');
        setIsWebSocketEnabled(false);
        setCurrentFile(null);
        setDownloadProgress(0);
      },
      onFileStart: (fileInfo) => {
        setCurrentFile({
          name: fileInfo.name,
          size: fileInfo.size
        });
        setDownloadProgress(0);
        setStatusMessage(`Receiving video: ${fileInfo.name}`);
        console.log('Started receiving file:', fileInfo.name);
      },
      onFileProgress: (progress) => {
        setDownloadProgress(progress);
        setStatusMessage(`Downloading: ${progress}%`);
      },
      onFileComplete: async (videoId: string, fileName: string) => {
        setDownloadProgress(100);
        setStatusMessage(`Video saved: ${fileName}`);
        showSuccessToast(`Video saved to storage: ${fileName}`);
        
        await loadSavedVideos();
        
        setTimeout(() => {
          setCurrentFile(null);
          setDownloadProgress(0);
          setStatusMessage('Ready for next video...');
          
          setTimeout(() => {
            handleWebSocketToggle(false);
          }, 2000);
        }, 3000);
      },
      onError: (error) => {
        setConnectionStatus('error');
        setStatusMessage(`Error: ${error}`);
        showErrorToast(error);
      }
    });
  }, [loadSavedVideos]);

  useEffect(() => {
    handleCreditBalance();
    loadSavedVideos(); 
  }, [handleCreditBalance, loadSavedVideos]);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'success';
      case 'connecting': return 'warning';
      case 'error': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <MdWifi className="tw-text-green-500" />;
      case 'connecting': return <MdWifi className="tw-text-yellow-500" />;
      case 'error': return <MdWifiOff className="tw-text-red-500" />;
      default: return <MdWifiOff className="tw-text-gray-500" />;
    }
  };

  return (
    <Container className="tw-text-center tw-mt-12">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} className="tw-px-4">
          <Card className="tw-shadow-xl tw-rounded-lg tw-bg-white tw-p-6">
            <Card.Body>
              <h3 className="tw-text-xl tw-font-bold tw-mb-8 tw-text-custom-color-blue">
                Your Profile
              </h3>
              <div className="tw-w-28 tw-h-28 tw-rounded-full tw-bg-[#26A1B0] tw-flex tw-items-center tw-justify-center tw-text-white tw-text-5xl tw-font-bold tw-mx-auto tw-uppercase">
                {firstInitial}
              </div>
              <div className="tw-text-xl tw-font-semibold tw-text-gray-900 tw-text-center tw-mt-4">
                {userName}
              </div>
              <div className="tw-flex tw-items-center tw-space-x-2 tw-text-gray-700 tw-text-base tw-text-center tw-mt-3">
                <MdPersonOutline className="tw-text-2xl" />
                <div>Joined on {formattedCreatedAt}</div>
              </div>
              <div className="tw-flex tw-items-center tw-space-x-2 tw-text-gray-700 tw-text-base tw-text-center tw-mt-3">
                <MdOutlineCreditScore className="tw-text-2xl" />
                <div>Credits: {creditBalance}</div>
                <span>
                  <Button
                    className="button button-primary-auto tw-ml-2"
                    onClick={handlePurchase}
                  >
                    Buy credits
                  </Button>
                  <CreditsModal
                    showModal={showCreditsModal}
                    closeModal={closeCreditsModal}
                    onConfirmPurchase={handleConfirm}
                    credits={credits}
                    setCredits={setCredits}
                    amount={amount}
                  />
                </span>
              </div>
              
              {/* WebSocket Video Receiver Section */}
              <div className="tw-mt-8 tw-p-4 tw-border tw-border-gray-200 tw-rounded-lg tw-bg-gray-50">
                <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
                  <div className="tw-flex tw-items-center tw-space-x-2">
                    <MdCloudDownload className="tw-text-2xl tw-text-blue-500" />
                    <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                      Video Receiver
                    </h4>
                    {getStatusIcon()}
                  </div>
                  <Form.Check
                    type="switch"
                    id="websocket-switch"
                    checked={isWebSocketEnabled}
                    onChange={(e) => handleWebSocketToggle(e.target.checked)}
                    disabled={connectionStatus === 'connecting'}
                    className="tw-scale-125"
                  />
                </div>
                
                {/* Status Message */}
                {statusMessage && (
                  <Alert variant={getStatusColor()} className="tw-mb-3 tw-text-sm">
                    {statusMessage}
                  </Alert>
                )}
                
                {/* File Download Progress */}
                {currentFile && (
                  <div className="tw-mb-4">
                    <div className="tw-text-sm tw-text-gray-600 tw-mb-2">
                      <strong>{currentFile.name}</strong> ({(currentFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </div>
                    <ProgressBar 
                      now={downloadProgress} 
                      label={`${downloadProgress}%`}
                      variant={downloadProgress === 100 ? 'success' : 'info'}
                      className="tw-h-6"
                    />
                  </div>
                )}
                
                {/* Connection Instructions */}
                {!isWebSocketEnabled && connectionStatus === 'disconnected' && (
                  <div className="tw-text-sm tw-text-gray-600 tw-text-left">
                    <p className="tw-mb-2">
                      📹 <strong>Enable Video Receiver to:</strong>
                    </p>
                    <ul className="tw-list-disc tw-list-inside tw-space-y-1">
                      <li>Connect to the video server (localhost:3003)</li>
                      <li>Automatically receive and save video files</li>
                      <li>Store videos in local database for offline viewing</li>
                    </ul>
                  </div>
                )}
                
                {/* Server Setup Instructions */}
                {connectionStatus === 'error' && (
                  <div className="tw-text-sm tw-text-left tw-bg-red-50 tw-p-3 tw-rounded tw-border tw-border-red-200">
                    <p className="tw-mb-2 tw-text-red-800">
                      <strong>🚨 Server Connection Failed</strong>
                    </p>
                    <div className="tw-text-red-700 tw-space-y-1">
                      <p><strong>To fix this:</strong></p>
                      <ol className="tw-list-decimal tw-list-inside tw-space-y-1">
                        <li>Open terminal/command prompt</li>
                        <li>Navigate to your server directory</li>
                        <li>Run: <code className="tw-bg-red-100 tw-px-1 tw-rounded">node launcher.js</code></li>
                        <li>Wait for "🎯 WebSocket server is LISTENING"</li>
                        <li>Try connecting again</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Storage Section */}
              <div className="tw-mt-6 tw-p-4 tw-border tw-border-gray-200 tw-rounded-lg tw-bg-gray-50">
                <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
                  <div className="tw-flex tw-items-center tw-space-x-2">
                    <MdStorage className="tw-text-2xl tw-text-purple-500" />
                    <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                      Saved Videos
                    </h4>
                  </div>
                  <div className="tw-flex tw-space-x-2">
                    {savedVideos.length > 0 && (
                      <>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={handleDownloadAllVideos}
                          className="tw-text-xs tw-flex tw-items-center tw-space-x-1"
                        >
                          <MdDownload className="tw-text-sm" />
                          <span>Download All</span>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={handleClearAllVideos}
                          className="tw-text-xs"
                        >
                          Clear All
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Storage Info */}
                <div className="tw-text-sm tw-text-gray-600 tw-mb-3">
                  📊 {storageInfo.count} videos • {formatFileSize(storageInfo.totalSize)} total
                </div>

                {/* Videos List */}
                {savedVideos.length > 0 ? (
                  <ListGroup className="tw-max-h-64 tw-overflow-y-auto">
                    {savedVideos.map((video) => (
                      <ListGroup.Item
                        key={video.id}
                        className="tw-flex tw-items-center tw-justify-between tw-py-2"
                      >
                        <div className="tw-flex-1 tw-text-left">
                          <div className="tw-font-medium tw-text-sm">{video.fileName}</div>
                          <div className="tw-text-xs tw-text-gray-500">
                            {formatFileSize(video.size)} • {new Date(video.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="tw-flex tw-space-x-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handlePlayVideo(video)}
                            className="tw-flex tw-items-center tw-space-x-1"
                          >
                            <MdPlayArrow className="tw-text-sm" />
                            <span className="tw-text-xs">Play</span>
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleDownloadVideo(video)}
                            disabled={downloadingVideos.has(video.id)}
                            className="tw-flex tw-items-center tw-space-x-1"
                          >
                            <MdDownload className="tw-text-sm" />
                            <span className="tw-text-xs">
                              {downloadingVideos.has(video.id) ? 'Downloading...' : 'Download'}
                            </span>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteVideo(video.id)}
                            className="tw-flex tw-items-center"
                          >
                            <MdDelete className="tw-text-sm" />
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <div className="tw-text-center tw-text-gray-500 tw-py-8">
                    <MdStorage className="tw-text-4xl tw-text-gray-300 tw-mx-auto tw-mb-2" />
                    <p className="tw-text-sm">No videos saved yet</p>
                    <p className="tw-text-xs">Connect to the video server to receive videos</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
            {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          show={showVideoPlayer}
          onHide={() => {
            setShowVideoPlayer(false);
            setSelectedVideo(null);
          }}
          video={selectedVideo}
        />
      )}
    </Container>
  );
};

export default Profile;