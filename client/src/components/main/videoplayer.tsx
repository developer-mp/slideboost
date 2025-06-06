import React, { useRef, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { MdClose, MdFullscreen, MdDownload } from 'react-icons/md';
import indexedDBService, { VideoFile } from '../../utils/storage/indexDb';

interface VideoPlayerModalProps {
  show: boolean;
  onHide: () => void;
  video: VideoFile | null;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  show,
  onHide,
  video
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show && video) {
      setIsLoading(true);
      try {
        const url = indexedDBService.createVideoURL(video);
        setVideoUrl(url);
        console.log('✅ Created blob URL for video:', video.fileName);
      } catch (error) {
        console.error('Error creating video URL:', error);
      } finally {
        setIsLoading(false);
      }
    }

    return () => {
      if (videoUrl) {
        indexedDBService.revokeVideoURL(videoUrl);
        setVideoUrl('');
        console.log('🧹 Cleaned up blob URL');
      }
    };
  }, [show, video]);

  useEffect(() => {
    if (show && videoRef.current && videoUrl) {
      videoRef.current.currentTime = 0;
      videoRef.current.load(); 
    }
  }, [show, videoUrl]);

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleDownload = () => {
    if (video && videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = video.fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleModalHide = () => {
    if (videoUrl) {
      indexedDBService.revokeVideoURL(videoUrl);
      setVideoUrl('');
    }
    onHide();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!video) return null;

  return (
    <Modal
      show={show}
      onHide={handleModalHide}
      size="lg"
      centered
      className="video-player-modal"
    >
      <Modal.Header className="tw-border-b tw-border-gray-200 tw-bg-gray-50">
        <div className="tw-flex tw-items-center tw-justify-between tw-w-full">
          <div>
            <Modal.Title className="tw-text-lg tw-font-semibold tw-text-gray-800">
              {video.fileName}
            </Modal.Title>
            <div className="tw-text-sm tw-text-gray-600">
              {formatFileSize(video.size)} • {video.mimeType}
            </div>
          </div>
          <div className="tw-flex tw-items-center tw-space-x-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleFullscreen}
              className="tw-flex tw-items-center tw-space-x-1"
              title="Fullscreen"
              disabled={!videoUrl}
            >
              <MdFullscreen />
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleDownload}
              className="tw-flex tw-items-center tw-space-x-1"
              title="Download"
              disabled={!videoUrl}
            >
              <MdDownload />
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleModalHide}
              className="tw-flex tw-items-center"
              title="Close"
            >
              <MdClose />
            </Button>
          </div>
        </div>
      </Modal.Header>
      
      <Modal.Body className="tw-p-0 tw-bg-black">
        <div className="tw-relative tw-w-full" style={{ minHeight: '400px' }}>
          {isLoading ? (
            <div className="tw-flex tw-items-center tw-justify-center tw-h-96 tw-text-white">
              <div className="tw-text-center">
                <div className="tw-animate-spin tw-rounded-full tw-h-12 tw-w-12 tw-border-b-2 tw-border-white tw-mx-auto tw-mb-4"></div>
                <p>Loading video...</p>
              </div>
            </div>
          ) : videoUrl ? (
            <video
              ref={videoRef}
              className="tw-w-full tw-h-full tw-object-contain"
              controls
              preload="metadata"
              style={{ maxHeight: '70vh' }}
              onError={(e) => {
                console.error('Video playback error:', e);
              }}
              onLoadStart={() => {
                console.log('Video loading started');
              }}
              onCanPlay={() => {
                console.log('Video can start playing');
              }}
            >
              <source src={videoUrl} type={video.mimeType} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="tw-flex tw-items-center tw-justify-center tw-h-96 tw-text-white">
              <p>Unable to load video</p>
            </div>
          )}
        </div>
      </Modal.Body>
      
      <Modal.Footer className="tw-border-t tw-border-gray-200 tw-bg-gray-50 tw-text-center">
        <div className="tw-text-sm tw-text-gray-600 tw-w-full">
          💡 Use the video controls to play, pause, and adjust volume. 
          Click fullscreen for better viewing.
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default VideoPlayerModal;