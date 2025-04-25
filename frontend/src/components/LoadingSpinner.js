import React from 'react';
import { FaBookOpen } from 'react-icons/fa';

const LoadingSpinner = () => {
  const messages = [
    'Flipping through the pages of knowledge...',
    'Brewing some academic magic...',
    'Chasing rogue assignments...',
    'Polishing your grades...',
  ];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className="loading-spinner">
      <FaBookOpen className="book-icon" />
      <p>{randomMessage}</p>
    </div>
  );
};

export default LoadingSpinner;