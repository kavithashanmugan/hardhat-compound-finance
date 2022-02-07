require("@nomiclabs/hardhat-waffle");

module.exports = {
  networks: {
   
  },
  solidity: {
    compilers: [
      {
        version: '0.5.16',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      }
    ],
  },
};