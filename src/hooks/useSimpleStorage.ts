import { useState } from 'react';
import { ethers } from 'ethers';
import { getSimpleStorageContract } from '@/lib/contract';

const getContract = getSimpleStorageContract();
const contract = await getContract();
await contract.store(123);


export function useSimpleStorage() {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<string>('');

  // Connect MetaMask wallet & return address
  async function connectWallet() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0] as string;
  }

  // Store a new uint256 value on-chain
  async function storeData(num: number) {
    setLoading(true);
    try {
      const contract = getSimpleStorageContract();
      const tx = await contract.store(num);
      await tx.wait();
      alert('Data stored on chain!');
    } catch (error) {
      console.error(error);
      alert('Transaction failed');
    } finally {
      setLoading(false);
    }
  }

  // Retrieve the stored value from chain
  async function fetchData() {
    setLoading(true);
    try {
      const contract = getSimpleStorageContract();
      const result: ethers.BigNumber = await contract.retrieve();
      setValue(result.toString());
    } catch (error) {
      console.error(error);
      alert('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }

  return { connectWallet, storeData, fetchData, value, loading };
}
