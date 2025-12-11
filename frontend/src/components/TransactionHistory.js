import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './TransactionHistory.css';
import { apiService } from '../services/apiService';
import { formatAddress, formatDateTime } from '../utils/formatters';
import Loading from './common/Loading';
import Error from './common/Error';
import EmptyState from './common/EmptyState';

const TransactionHistory = ({ account }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const walletAddress = account || null;
      const response = await apiService.getTransactions(walletAddress, 20);
      setTransactions(response.transactions || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const formattedAccount = useMemo(() => formatAddress(account), [account]);

  if (loading) {
    return (
      <div className="transaction-history-container">
        <Loading message="Loading transactions..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-history-container">
        <Error message={error} onRetry={fetchTransactions} />
      </div>
    );
  }

  return (
    <div className="transaction-history-container">
      <div className="transaction-header">
        <h2>Transaction History</h2>
        {account && (
          <div className="wallet-filter">
            Filtering for: {formattedAccount}
          </div>
        )}
      </div>

      <div className="transactions-list">
        {transactions.length === 0 ? (
          <EmptyState message="No transactions found" />
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
                    {formatDateTime(transaction.timestamp)}
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


