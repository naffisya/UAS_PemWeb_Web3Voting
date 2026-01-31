import React, { useState } from 'react';
import './app.css';
import WalletConnect from './components/WalletConnect';
import PollList from './components/PollList';
import VotingInterface from './components/VotingInterface';
import TransactionList from './components/TransactionList';

function app() {
  const [account, setAccount] = useState('');
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleWalletConnected = (connectedAccount) => {
    setAccount(connectedAccount);
    console.log('Wallet connected:', connectedAccount);
  };

  const handleWalletDisconnected = () => {
    setAccount('');
    console.log('Wallet disconnected');
  };

  const handleSelectPoll = (poll) => {
    setSelectedPoll(poll);
    setShowVotingModal(true);
  };

  const handleCloseModal = () => {
    setShowVotingModal(false);
    setSelectedPoll(null);
  };

  const handleVoteSuccess = () => {
    // Refresh poll list after successful vote
    setRefreshKey(prev => prev + 1);
    setTimeout(() => {
      handleCloseModal();
    }, 2000);
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <div className="app-title">
          <h1>🗳️ Blockchain Voting System</h1>
          <p>Secure, Transparent, and Decentralized E-Voting on Sepolia Testnet</p>
        </div>
        <WalletConnect 
          onWalletConnected={handleWalletConnected}
          onWalletDisconnected={handleWalletDisconnected}
        />
      </header>

      {/* Main Content */}
      <main>
        {/* Poll List */}
        <PollList 
          account={account}
          onSelectPoll={handleSelectPoll}
          key={refreshKey}
        />

        {/* Transaction List */}
        <TransactionList />
      </main>

      {/* Voting Modal */}
      {showVotingModal && selectedPoll && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              ×
            </button>
            <VotingInterface 
              poll={selectedPoll}
              account={account}
              onVoteSuccess={handleVoteSuccess}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '30px 20px',
        color: 'white',
        marginTop: '40px'
      }}>
        <p style={{ marginBottom: '10px' }}>
          💡 Built with React.js, Node.js, and Ethereum Blockchain
        </p>
        <p style={{ fontSize: '0.9em', opacity: 0.8 }}>
          Secure & Transparent Voting System | Sepolia Testnet
        </p>
      </footer>
    </div>
  );
}

export default app;