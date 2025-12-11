import React from 'react';
import './Error.css';

const Error = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <div className="error-message">{message}</div>
      {onRetry && (
        <button onClick={onRetry} className="error-retry-btn">
          Retry
        </button>
      )}
    </div>
  );
};

export default Error;

