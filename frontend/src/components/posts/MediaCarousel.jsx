import React, { useState } from 'react';

const MediaCarousel = ({ media }) => {
  const [current, setCurrent] = useState(0);

  const handleNavClick = (direction) => {
    if (direction === 'prev') {
      setCurrent((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    } else if (direction === 'next') {
      setCurrent((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className="media-carousel">
      <div className={`media-grid media-count-${media.length}`}>
        {media.map((mediaItem, index) => (
          <div
            key={mediaItem._id}
            className="media-item"
            style={{ display: index === current ? 'block' : 'none' }}
          >
            {mediaItem.mediaType === 'image' ? (
              <img
                src={mediaItem.url}
                alt={`Post media ${index + 1}`}
                className="media-content"
                onError={(e) => {
                  e.target.onerror = null;
                }}
              />
            ) : (
              <video controls className="media-content">
                <source src={mediaItem.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </div>
      {media.length > 1 && (
        <div className="media-navigation">
          <button
            className="media-nav-button prev"
            onClick={() => handleNavClick('prev')}
          >
            &lt;
          </button>
          <button
            className="media-nav-button next"
            onClick={() => handleNavClick('next')}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaCarousel; 