require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia:{
      url: process.env.ALCHEMY_TESTNET_RPC_URL,
      accounts: [process.env.TEST_PRIVATE_KEY]
    }
  }
};

// Run this command to deploy on localhost
// npx hardhat node (spin up local hardhat node - do on a separate terminal)
// npx hardhat ignition deploy ignition/modules/Lock.js --network localhost

// Run this command to deploy on testnet
// npx hardhat ignition deploy ignition/modules/Lock.js --network sepolia