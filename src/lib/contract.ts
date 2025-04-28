import { ethers } from 'ethers';
import SimpleStorageAbi from '@/abi/SimpleStorage.json';

// ✅ Replace this with your deployed contract address
const contractAddress = '0x909C655D59E02cc3e549903C7AAa60a2Da436116';

export function getSimpleStorageContract() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  // ✅ ethers v6 uses BrowserProvider instead of Web3Provider
  const provider = new ethers.BrowserProvider(window.ethereum as any);

  // Return an async function that resolves the contract instance
  const getContract = async () => {
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, SimpleStorageAbi, signer);
  };

  return getContract;
}
