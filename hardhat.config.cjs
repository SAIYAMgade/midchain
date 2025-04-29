require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL,         // Example: "https://sepolia.infura.io/v3/your-infura-key"
      accounts: [process.env.PRIVATE_KEY],  // Your deployer wallet private key (without 0x prefix)
    },
  },
};
