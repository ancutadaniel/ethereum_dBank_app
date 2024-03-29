require('dotenv').config({ path: './.env' });

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  contracts_directory: './src/contracts',
  contracts_build_directory: './src/build/abi',

  networks: {
    localhost: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*', // Match any network id
    },
    // kovan: {
    //   provider: function () {
    //     return new HDWalletProvider(
    //       privateKeys.split(','), // Array of account private keys
    //       `https://kovan.infura.io/v3/${process.env.PROJECT_ID}` // Url to an Ethereum Node
    //     );
    //   },
    //   gas: 5000000,
    //   gasPrice: 5000000000, // 5 gwei
    //   network_id: 42,
    // },
    goerli: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC,
          `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`
        ),
      network_id: 5,
    },
    // ropsten: {
    //   provider: () =>
    //     new HDWalletProvider(
    //       process.env.MNEMONIC,
    //       `wss://ropsten.infura.io/ws/v3/${process.env.PROJECT_ID}`
    //     ),
    //   network_id: 3,
    //   gas: 5500000,
    //   confirmations: 2,
    //   timeoutBlocks: 200,
    //   skipDryRun: true,
    // },
    // rinkeby: {
    //   provider: () =>
    //     new HDWalletProvider(
    //       process.env.MNEMONIC,
    //       `https://rinkeby.infura.io/v3/${process.env.PROJECT_ID}`
    //     ),
    //   network_id: 4,
    //   gas: 5500000,
    // },
  },

  compilers: {
    solc: {
      version: '0.8.13',
      settings: {
        optimizer: {
          enabled: false,
          runs: 200,
        },
      },
    },
  },
};
