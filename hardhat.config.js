require("@nomiclabs/hardhat-waffle");
const dotenv = require('dotenv');
dotenv.config();
const ALCHEMY_API_KEY = "KEY";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  networks: {
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/5Xc0syloVXn1tmO4OF7rncbrD_ZhBVfd",
      accounts: [PRIVATE_KEY]
    }
   
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