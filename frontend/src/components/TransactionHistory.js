import React, { useState, useEffect } from 'react';
import './TransactionHistory.css';
import { apiService } from '../services/apiService';

const TransactionHistory = ({ account }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        // Call apiService.getTransactions with account address if available
        const walletAddress = account || null;
        const response = await apiService.getTransactions(walletAddress, 20);
        
        // Update transactions state
        setTransactions(response.transactions || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [account]);

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="transaction-history-container">
        <div className="loading">Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-history-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="transaction-history-container">
      <div className="transaction-header">
        <h2>Transaction History</h2>
        {account && (
          <div className="wallet-filter">
            Filtering for: {formatAddress(account)}
          </div>
        )}
      </div>

      <div className="transactions-list">
        {transactions.length === 0 ? (
          <div className="placeholder">
            <p>No transactions found</p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction.id} className="transaction-card">
              <div className="transaction-header-info">
                <span className={`transaction-type ${transaction.type}`}>
                  {transaction.type.replace('_', ' ')}
                </span>
                <span className={`transaction-status ${transaction.status}`}>
                  {transaction.status}
                </span>
              </div>
              <div className="transaction-details">
                <div className="transaction-detail-item">
                  <div className="transaction-detail-label">From</div>
                  <div className="transaction-detail-value address">
                    {formatAddress(transaction.from)}
                  </div>
                </div>
                <div className="transaction-detail-item">
                  <div className="transaction-detail-label">To</div>
                  <div className="transaction-detail-value address">
                    {formatAddress(transaction.to)}
                  </div>
                </div>
                <div className="transaction-detail-item">
                  <div className="transaction-detail-label">Amount</div>
                  <div className="transaction-amount">
                    {transaction.amount} {transaction.currency}
                  </div>
                </div>
                <div className="transaction-detail-item">
                  <div className="transaction-detail-label">Timestamp</div>
                  <div className="transaction-timestamp">
                    {formatDate(transaction.timestamp)}
                  </div>
                </div>
                {transaction.blockchainTxHash && (
                  <div className="transaction-detail-item">
                    <div className="transaction-detail-label">Transaction Hash</div>
                    <div className="transaction-detail-value hash">
                      {transaction.blockchainTxHash}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;


