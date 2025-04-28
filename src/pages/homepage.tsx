import React, { useState } from 'react';
import { useSimpleStorage } from '@/hooks/useSimpleStorage';

export default function HomePage() {
  const { connectWallet, storeData, fetchData, value, loading } = useSimpleStorage();
  const [input, setInput] = useState<number>(0);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Simple Storage DApp</h1>

      <button 
        onClick={connectWallet} 
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Connect MetaMask
      </button>

      <div className="mt-6">
        <input
          type="number"
          value={input}
          onChange={e => setInput(Number(e.target.value))}
          className="border p-2 mr-2"
        />
        <button
          onClick={() => storeData(input)}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Store on Chain
        </button>
      </div>

      <div className="mt-6">
        <button
          onClick={fetchData}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Fetch Stored Value
        </button>

        {value !== '' && (
          <p className="mt-4 text-lg">On-chain value: <strong>{value}</strong></p>
        )}
      </div>
    </div>
  );
}
