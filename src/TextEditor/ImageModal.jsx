import React from 'react';
import { BsX, BsZoomIn, BsZoomOut, BsDownload } from 'react-icons/bs';
import styles from './ImageModal.module.css';

const ImageModal = ({ isOpen, imageUrl, onClose }) => {
  const [zoom, setZoom] = React.useState(1);
  const [isDragging, setIsDragging] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });

  // Reset zoom and position when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header with controls */}
        <div className={styles.modalHeader}>
          <div className={styles.controls}>
            <button onClick={handleZoomOut} disabled={zoom <= 0.5} title="Zoom ut">
              <BsZoomOut />
            </button>
            <span className={styles.zoomLevel}>{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} disabled={zoom >= 3} title="Zoom inn">
              <BsZoomIn />
            </button>
          </div>
          <button className={styles.closeButton} onClick={onClose} title="Lukk">
            <BsX />
          </button>
        </div>

        {/* Image container */}
        <div className={styles.imageContainer}>
          <img
            src={imageUrl}
            alt="Forstørret bilde"
            className={styles.modalImage}
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            draggable={false}
          />
        </div>

        {/* Instructions */}
        <div className={styles.instructions}>
          {zoom > 1 ? 'Dra for å flytte bildet' : 'Bruk zoom-knappene for å forstørre'}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;