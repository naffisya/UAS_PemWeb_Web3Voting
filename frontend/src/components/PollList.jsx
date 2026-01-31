import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract-config';

const PollList = ({ account, onSelectPoll }) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPolls();
  }, [account]);

  const loadPolls = async () => {
    setLoading(true);
    setError('');

    try {
      if (CONTRACT_ADDRESS === "0x_YOUR_CONTRACT_ADDRESS_HERE") {
        throw new Error('Contract not deployed yet. Using demo data from backend API.');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const pollCount = await contract.pollCount();
      const pollsData = [];

      for (let i = 1; i <= Number(pollCount); i++) {
        const pollInfo = await contract.getPollInfo(i);
        const [candidateNames, voteCounts] = await contract.getPollResults(i);
        
        const candidates = candidateNames.map((name, index) => ({
          id: index + 1,
          name: name,
          voteCount: Number(voteCounts[index])
        }));

        pollsData.push({
          id: i,
          title: pollInfo.title,
          description: pollInfo.description,
          startTime: new Date(Number(pollInfo.startTime) * 1000).toISOString(),
          endTime: new Date(Number(pollInfo.endTime) * 1000).toISOString(),
          isActive: pollInfo.isActive,
          totalVotes: Number(pollInfo.totalVotes),
          candidates: candidates
        });
      }

      setPolls(pollsData);

    } catch (err) {
      console.error('Error loading polls from blockchain:', err);
      // Fallback to backend API
      loadPollsFromAPI();
    } finally {
      setLoading(false);
    }
  };

  const loadPollsFromAPI = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/polls');
      const data = await response.json();
      
      if (data.success) {
        setPolls(data.data);
      }
    } catch (err) {
      setError('Failed to load polls. Please ensure backend is running.');
      console.error('Error loading polls from API:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isVotingOpen = (poll) => {
    const now = new Date();
    const endTime = new Date(poll.endTime);
    return poll.isActive && now <= endTime;
  };

  if (loading) {
    return (
      <div className="poll-list-loading">
        <div className="spinner"></div>
        <p>Loading polls...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="poll-list-error">
        <p>⚠️ {error}</p>
        <button onClick={loadPolls} className="retry-button">
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className="poll-list-container">
      <div className="poll-list-header">
        <h2>📊 Available Polls</h2>
        <button onClick={loadPolls} className="refresh-button">
          🔄 Refresh
        </button>
      </div>

      {polls.length === 0 ? (
        <div className="poll-list-empty">
          <p>📭 No polls available yet</p>
          <p style={{ fontSize: '0.9em', color: '#666' }}>
            {account ? 'Check back later for new polls!' : 'Connect your wallet to participate'}
          </p>
        </div>
      ) : (
        <div className="poll-grid">
          {polls.map((poll) => (
            <div 
              key={poll.id} 
              className={`poll-card ${isVotingOpen(poll) ? 'active' : 'closed'}`}
              onClick={() => onSelectPoll(poll)}
            >
              <div className="poll-card-header">
                <h3>{poll.title}</h3>
                <span className={`poll-status ${isVotingOpen(poll) ? 'open' : 'closed'}`}>
                  {isVotingOpen(poll) ? '🟢 Open' : '🔴 Closed'}
                </span>
              </div>
              
              <p className="poll-description">{poll.description}</p>
              
              <div className="poll-meta">
                <div className="poll-meta-item">
                  <span className="label">Total Votes:</span>
                  <span className="value">{poll.totalVotes}</span>
                </div>
                <div className="poll-meta-item">
                  <span className="label">Candidates:</span>
                  <span className="value">{poll.candidates.length}</span>
                </div>
              </div>
              
              <div className="poll-timing">
                <p><strong>Ends:</strong> {formatDate(poll.endTime)}</p>
              </div>
              
              <button className="view-poll-button">
                View Poll →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PollList;