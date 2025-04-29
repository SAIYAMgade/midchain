import React, { useState, useEffect } from 'react';
import { ethers, BrowserProvider } from 'ethers';

const StoreDataPage: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<number>(0);
  const [storedValue, setStoredValue] = useState<number>(0);
  const [status, setStatus] = useState<string>('');

  const CONTRACT_ADDRESS = '0x909C655D59E02cc3e549903C7AAa60a2Da436116';

  const CONTRACT_ABI = [
    {
      "inputs": [{ "internalType": "uint256", "name": "_data", "type": "uint256" }],
      "name": "store",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "retrieve",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // ✅ Clean status update helper
  const updateStatus = (message: string, timeout = 4000) => {
    setStatus(message);
    if (timeout) {
      setTimeout(() => setStatus(''), timeout);
    }
  };

  // ✅ Connect wallet
  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        const provider = new BrowserProvider((window as any).ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        updateStatus('✅ Wallet connected');
        console.log('Connected account:', address);
      } catch (error) {
        console.error('Wallet connection failed:', error);
        updateStatus('❌ Connection failed');
      }
    } else {
      updateStatus('🦊 MetaMask not detected');
      console.log('Please install MetaMask');
    }
  };

  // ✅ Store data on-chain
  const storeData = async () => {
    if (!account) {
      updateStatus('⚠️ Connect your wallet first');
      return;
    }

    try {
      updateStatus('🔄 Sending transaction...');
      const provider = new BrowserProvider((window as any).ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      console.log("Signer address:", signerAddress);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.store(inputValue);
      console.log('Transaction sent, hash:', tx.hash);
      updateStatus(`📤 Transaction sent: ${tx.hash}`, 6000);

      await tx.wait();
      updateStatus('✅ Transaction confirmed! Fetching new value...');

      const value = await contract.retrieve();
      setStoredValue(Number(value));
      console.log('Stored value updated:', value.toString());
      updateStatus('🎉 Value updated on-chain ✅');
    } catch (error: any) {
      console.error('Error storing data:', error);
      updateStatus('⚠️ Attempted to store data — check wallet or contract config');
    }
  };

  // ✅ Fetch stored data
  const fetchData = async () => {
    if ((window as any).ethereum) {
      try {
        const provider = new BrowserProvider((window as any).ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const value = await contract.retrieve();
        setStoredValue(Number(value));
        console.log('Fetched stored value:', value.toString());
      } catch (error) {
        console.error('Error reading data:', error);
      }
    }
  };

  // ✅ Check MetaMask connection on load
  useEffect(() => {
    const checkConnection = async () => {
      if ((window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };

    checkConnection();
  }, []);

  // ✅ Listen for account changes
  useEffect(() => {
    if ((window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, []);

  // ✅ Check network and contract status on load
  useEffect(() => {
    const checkNetworkAndContract = async () => {
      if (!(window as any).ethereum) return;
      const provider = new BrowserProvider((window as any).ethereum);
      const network = await provider.getNetwork();
      console.log("Network:", network);
      const code = await provider.getCode(CONTRACT_ADDRESS);
      console.log("Contract bytecode:", code);
      if (code === '0x') {
        console.warn("⚠️ No contract deployed at this address on this network");
      }
    };

    checkNetworkAndContract();
    fetchData();
  }, []);

  // ✅ UI
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Store & Retrieve Data</h1>
      <button onClick={connectWallet}>
        {account ? 'Wallet Connected' : 'Connect MetaMask'}
      </button>

      <div style={{ marginTop: '1rem' }}>
        <input
          type="number"
          value={inputValue}
          onChange={e => setInputValue(Number(e.target.value))}
          style={{ padding: '0.5rem', width: '6rem' }}
        />
        <button onClick={storeData} style={{ marginLeft: '1rem' }}>
          Store Data
        </button>
        <button onClick={fetchData} style={{ marginLeft: '1rem' }}>
          Fetch Data
        </button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <strong>Account:</strong> {account ? account : 'Not connected'}
      </div>
      <div>
        <strong>Stored Value:</strong> {storedValue}
      </div>
      <div style={{ marginTop: '1rem', color: 'green' }}>{status}</div>
    </div>
  );
};

export default StoreDataPage;
