import React, { useState } from 'react';

const StoreDataPage: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<number>(0);
  const [storedValue, setStoredValue] = useState<number>(0);
  const [status, setStatus] = useState<string>('');

  // Mock wallet connection
  const connectWallet = async () => {
    setAccount('0x909C655D59E02cc3e549903C7AAa60a2Da436116');
    setStatus('✅ Wallet connected');
  };

  // Mock store function
  const storeData = async () => {
    if (!account) {
      setStatus('⚠️ Connect your wallet first');
      return;
    }
    setStatus('🔄 Pretending to send transaction...');
    setTimeout(() => {
      setStoredValue(inputValue);
      setStatus('🎉 Value updated (mock)');
    }, 1000);
  };

  // Mock fetch function
  const fetchData = async () => {
    setStatus('🔍 Fetching stored value...');
    setTimeout(() => {
      setStatus(`📦 Stored value is: ${storedValue}`);
    }, 500);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Mock Blockchain Storage DApp</h1>
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
        <strong>Account:</strong> {account || 'Not connected'}
      </div>
      <div>
        <strong>Stored Value:</strong> {storedValue}
      </div>
      <div style={{ marginTop: '1rem', color: 'green' }}>{status}</div>
    </div>
  );
};

export default StoreDataPage;
