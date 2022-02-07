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
  const CEther = await hre.ethers.getContractFactory("CEther");
  console.log("Deploying contracts with the following params:", comptroller.address,whitePaperInterestRateModel.address,2.0e26,"Compound ETH","cETH",8,deployer.address); 
  const cether = await CEther.deploy(comptroller.address,whitePaperInterestRateModel.address,BigInt(2.0e26),"Compound ETH","cETH",8,deployer.address)
  console.log("cether deployed to:", cether.address); 
  const approval = await cether.approve(deployer.address,100000);
  console.log("approval is",approval)
  const result = await cether.mint("100000");
  console.log("result is",result)
  // const CEther = await hre.ethers.getContractFactory("CEther");
  // const cether = await CEther.deploy()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
