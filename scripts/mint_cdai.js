// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
   //const Greeter = await hre.ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy("Hello, Kavitha!");
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address); 

  const Comptroller = await hre.ethers.getContractFactory("Comptroller");
  const comptroller = await Comptroller.deploy();

  // await greeter.deployed();
  //, greeter.address
  console.log("Comptroller deployed to:", comptroller.address); // Returning the contract address on the rinkeby
  const WhitePaperInterestRateModel = await hre.ethers.getContractFactory("WhitePaperInterestRateModel");
  const whitePaperInterestRateModel = await WhitePaperInterestRateModel.deploy(BigInt(20000000000000000),BigInt(100000000000000000));
  console.log("whitePaperInterestRateModel deployed to:", whitePaperInterestRateModel.address); // Returning the contract address on the rinkeby


  //deploying underlying DAI Token contract for local use
  const DaiContract = await hre.ethers.getContractFactory("Dai");
  const dai = await DaiContract.deploy(1);
  console.log("address of underlying dai tokens is",dai.address);
  //deploying cDAI Token markets
  console.log("Deploying contracts with the following params:", comptroller.address,whitePaperInterestRateModel.address,2.0e26,"Compound ETH","cETH",8,deployer.address);
  const CErc20Delegate = await hre.ethers.getContractFactory("CErc20Delegate");
  const cerc20delegate = await CErc20Delegate.deploy();
  const CErc20Delegator = await hre.ethers.getContractFactory("CErc20Delegator");
  const cDaiTokenContract = await CErc20Delegator.deploy(dai.address,comptroller.address,whitePaperInterestRateModel.address,BigInt(200000000000000000000000000),"Compound DAI","cDAI",8,deployer.address,cerc20delegate.address,"0x");
  console.log("compound dai deployed to:", cDaiTokenContract.address); 


  //approve compound bat to access user wallet
  const approval = await dai.approve(cDaiTokenContract.address,BigInt(5000000000000000000));
  console.log("approval is",approval)
  //mint some dai to account

  const exchangeRateCurrent = await cDaiTokenContract.exchangeRateCurrent();
  console.log("exchange rate current",exchangeRateCurrent.data)
  const minted = await dai.mint(deployer.address,BigInt(1000000000000000000));
  console.log("minted",minted);
  //transfer minted dai to compound
  const cDaiMinted =  await cDaiTokenContract.mint(BigInt(1000000000000000000));
  console.log("cdai mintd",cDaiMinted);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
