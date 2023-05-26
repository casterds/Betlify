const HDWalletProvider = require("@truffle/hdwallet-provider");
const { MNEMONIC } = process.env;

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
    },
    matic: {
      provider: () =>
        new HDWalletProvider(
          MNEMONIC,
          `https://matic-mumbai.chainstacklabs.com`
        ),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      chainId: 80001,
    },
    gnosis: {
      provider: function () {
        return new HDWalletProvider({
          mnemonic: {
            phrase: MNEMONIC,
          },
          providerOrUrl: "https://rpc.gnosischain.com",
        });
      },
      network_id: 100,
      gas: 500000,
      gasPrice: 1000000000,
    },
    chiado: {
      provider: function () {
        return new HDWalletProvider({
          mnemonic: {
            phrase: MNEMONIC,
          },
          providerOrUrl: "https://rpc.chiadochain.net",
          numberOfAddresses: 1,
          shareNonce: true,
        });
      },
      network_id: 10200,
      gas: 500000,
      gasPrice: 1000000000,
    },
  },
  contracts_directory: "./contracts",
  contracts_build_directory: "./abis",
  compilers: {
    solc: {
      version: "^0.8.6",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  db: {
    enabled: false,
  },
};
