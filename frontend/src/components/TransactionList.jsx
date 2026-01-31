import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/contract-config';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/transactions`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      
      if (data.success) {
        setTransactions(data.data);
      } else {
        throw new Error(data.error || 'Failed to load transactions');
      }

    } catch (err) {
      console.error('Error loading transactions:', err);
      setError(err.message || 'Failed to connect to API');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 8)}...${addr.substring(addr.length - 6)}`;
  };

  const getTypeIcon = (type) => {
    return type === 'PollCreated' ? '📊' : '🗳️';
  };

  const getTypeColor = (type) => {
    return type === 'PollCreated' ? '#10b981' : '#3b82f6';
  };

  if (loading) {
    return (
      <div className="transactions-loading">
        <div className="spinner"></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transactions-error">
        <p>⚠️ {error}</p>
        <button onClick={loadTransactions} className="retry-button">
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <h2>📜 Recent Transactions</h2>
        <button onClick={loadTransactions} className="refresh-button">
          🔄 Refresh
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="transactions-empty">
          <p>No transactions found</p>
        </div>
      ) : (
        <div className="transactions-table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Poll</th>
                <th>Details</th>
                <th>Time</th>
                <th>Tx Hash</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>
                    <span 
                      className="transaction-type"
                      style={{ color: getTypeColor(tx.type) }}
                    >
                      {getTypeIcon(tx.type)} {tx.type}
                    </span>
                  </td>
                  <td className="poll-title">{tx.pollTitle}</td>
                  <td className="tx-details">
                    {tx.type === 'PollCreated' ? (
                      <span>by {formatAddress(tx.creator)}</span>
                    ) : (
                      <span>{formatAddress(tx.voter)} → {tx.candidateName}</span>
                    )}
                  </td>
                  <td className="timestamp">{formatDate(tx.timestamp)}</td>
                  <td className="tx-hash">
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="explorer-link"
                    >
                      {formatAddress(tx.txHash)}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="transactions-info">
        <p>💡 Showing {transactions.length} transaction(s) from backend API</p>
      </div>
    </div>
  );
};

export default TransactionList;