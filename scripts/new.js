//79228162514264337593543950335

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const BigNumber = ethers.BigNumber;
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  //supply dai
  //mint cdai
  //borrow uniswap 
 // await hre.run('compile');
  //const [deployer] = await ethers.getSigners();
  //console.log("Deploying contracts with the account:", deployer.address); 


  //#SUPPLYING ASSETS TO COMPOUND#//
//   console.log("###################SUPPLYING ASSETS TO COMPOUND#################################")
//   const Comptroller = await hre.ethers.getContractFactory("Comptroller");
//   const comptroller = await Comptroller.deploy();

 

  //console.log("Comptroller deployed to:", comptroller.address); // Returning the contract address 
  //const WhitePaperInterestRateModel = await hre.ethers.getContractFactory("WhitePaperInterestRateModel");
  //const whitePaperInterestRateModel = await WhitePaperInterestRateModel.deploy(BigInt(20000000000000000),BigInt(100000000000000000));
  //console.log("whitePaperInterestRateModel deployed to:", whitePaperInterestRateModel.address); // Returning the contract address on the rinkeby

 //SUPPLYING DAI TO COMPOUND
 //supply 1 DAI to compound protocol
//1-enable the token to supply or repay to compound protocol
//2-supply 1 DAI --> mintAmount:1000000000000000000
//3-get minted cDAI
 //cdai 
  const cDaiAddress = "0xbc689667c13fb2a04f09272753760e38a95b998c";
  const cDaiAbi = require("../abi/CDai.json");
  const cDaiToken = new hre.ethers.Contract(cDaiAddress,cDaiAbi,ethers.provider.getSigner());

  //dai 
  const DaiAddress = "0x31F42841c2db5173425b5223809CF3A38FEde360";
  const DaiAbi = require("../abi/Dai.json");
  const DaiToken = new hre.ethers.Contract(DaiAddress,DaiAbi,ethers.provider.getSigner());

 const balance = await hre.ethers.provider.getBalance("0xAFec3221bEab07cf2a1C97168d26Bf99209610BF");
  
  console.log("My Wallets ETH Balance",hre.ethers.utils.formatEther(balance));
  console.log("cDAI balance of my wallet",await cDaiToken.balanceOf("0xAFec3221bEab07cf2a1C97168d26Bf99209610BF"));
  console.log("DAI Balance of my wallet",await DaiToken.balanceOf("0xAFec3221bEab07cf2a1C97168d26Bf99209610BF"));
  //console.log("waitng for approval")
  //const approval = await DaiToken.connect(ethers.provider.getSigner()).approve(cDaiToken.address, '999999999999999999999999999999999');
  //console.log("approvong...")
  //const txn = await approval.wait();
  //console.log("txn#################### approval",txn.events);
  let daiDeposit = 1000000000000000000;
  console.log("before minting...",)
  // let mintedToken = await cDaiToken.connect(ethers.provider.getSigner()).mint(BigInt(5000000000000));
  // let mintedTxn = await mintedToken.wait();
  // let mintcAmount = (mintedTxn.events.find(x => x.event == 'Mint').args.mintTokens);
  // console.log("minted event is###################################################################",mintcAmount);
 // let exchangeRateCurrent = await cDaiToken.connect(ethers.provider.getSigner()).exchangeRateCurrent()
 let exchangeRateCurrent = await cDaiToken.exchangeRateStored();
 console.log("exchange rate stored cdai",exchangeRateCurrent);
 const BigNumber = ethers.BigNumber
 let exchangeRate = (exchangeRateCurrent);
 let mantissa =  BigNumber.from(10).pow(28);
 console.log("mantissa is ",mantissa);
 let mintAmountEth = 1;
  // let exchangeRateMantissa = (ethers.BigNumber.from(mantissa).div(exchangeRate));
  //     console.log("exchange rate mantissa is",exchangeRateMantissa);
  //let sample = ethers.BigNumber.from(1).mul(mantissa).div(exchangeRateCurrent);
//console.log("sample",sample)
      let cAmount = ethers.BigNumber.from(ethers.BigNumber.from(1).mul(mantissa).div(exchangeRateCurrent));
      console.log("cAmount calculated",cAmount)
  //const approval = await DaiToken.approve(cDaiToken,BigInt(5000000000000000000));
  //console.log("approval for spending dai by cdai",approval)

// const borrowRatePerBlock = await cDaiToken.methods.borrowRatePerBlock().call();
// console.log("borrow rate per block",borrowRatePerBlock);
 

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
