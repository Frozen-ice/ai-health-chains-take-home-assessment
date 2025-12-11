import React from 'react';
import './EmptyState.css';

const EmptyState = ({ message = 'No data found' }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">📭</div>
      <div className="empty-state-message">{message}</div>
    </div>
  );
};

export default EmptyState;

