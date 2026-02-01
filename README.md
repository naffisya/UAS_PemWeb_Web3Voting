# Blockchain Voting System
Aplikasi web full-stack yang mengintegrasikan blockchain Ethereum (Sepolia Testnet) untuk sistem voting yang aman, transparan, dan terdesentralisasi.

## Fitur
1. Frontend React.js: Interface responsif untuk voting
2. Backend Node.js/Express: RESTful API untuk data transaksi
3. Integrasi Blockchain: Koneksi ke Sepolia testnet menggunakan Ethers.js
4. Smart Contract: Voting contract dengan fitur anti-double voting
5. Wallet Integration: Koneksi dengan MetaMask
6. Responsive Design: Layout menggunakan CSS Grid dan Flexbox
7. Real-time Results: Tampilan hasil voting real-time

## Teknologi
1. Frontend: React.js, Ethers.js, CSS3
2. Backend: Node.js, Express.js
3. Blockchain: Ethereum Sepolia Testnet, Solidity
4. Tools: MetaMask, Remix (untuk deployment)

##Instalasi & Setup
Prasyarat

Node.js (v16 atau lebih tinggi)
MetaMask browser extension
Sepolia ETH untuk gas fees

1️. Clone Repository
bashgit clone <repository-url>
cd blockchain-voting-system
2️. Setup Backend
bashcd backend
npm install
npm start
3. Setup Frontend
bashcd frontend
npm install
npm start

## Konfigurasi
Setup MetaMask untuk Sepolia Testnet
1. Buka MetaMask
2. Klik network dropdown → "Add Network"
3. Pilih "Sepolia Test Network" atau tambahkan manual:
Network Name: Sepolia
RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
Chain ID: 11155111
Currency Symbol: ETH

##Smart Contract
Fungsi Utama Smart Contract:
Admin Functions:

##createPoll(string title, string description, string[] candidateNames, uint256 duration): Membuat poll baru
endPoll(uint256 pollId): Menutup poll
transferAdmin(address newAdmin): Transfer ownership

##Voter Functions:
vote(uint256 pollId, uint256 candidateId): Memberikan vote
hasVoted(uint256 pollId, address voter): Cek status voting

##View Functions:
getPollInfo(uint256 pollId): Informasi poll
getCandidate(uint256 pollId, uint256 candidateId): Informasi kandidat
getPollResults(uint256 pollId): Hasil voting

##Deploy Smart Contract
📌 Remix IDE 
Quick steps:

Buka https://remix.ethereum.org
Copy contract dari contracts/VotingSystem.sol
Compile & Deploy ke Sepolia
Copy contract address
Update di frontend/src/utils/contract-config.js

## File REMIX_DEPLOYMENT.md berisi:

Setup MetaMask untuk Sepolia
Cara dapatkan Sepolia ETH dari faucet
Step-by-step deployment dengan screenshots
Testing contract di Remix
Troubleshooting common issues

## Troubleshooting
1. Wallet tidak terkoneksi?
Pastikan MetaMask terinstall
Periksa network = Sepolia
Refresh halaman

2. Transaksi gagal?
Pastikan cukup Sepolia ETH
Cek gas price
Lihat console untuk error detail

3. Contract tidak ditemukan?
Verifikasi contract address di config
Pastikan contract sudah deployed

4. Sudah vote tapi masih bisa vote lagi?
Smart contract mencegah double voting
Jika masih terjadi, contract belum deployed
Gunakan demo mode (backend API)

##License
Project ini dibuat untuk keperluan pemenuhan tugas UAS.
