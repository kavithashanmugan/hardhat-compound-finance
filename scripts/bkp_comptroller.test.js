const { expect } = require("chai");
const { ethers } = require("hardhat");
const BigNumber = ethers.BigNumber;

let Comptroller;
let cDaiContract
let cUniContract;

//deploy compttroller
//check if following works

 beforeEach(async () => {
  const [deployer] = await ethers.getSigners();
  console.log("deployer uis",deployer)
  const comptroller = await hre.ethers.getContractFactory("Comptroller");
  const Comptroller = await comptroller.deploy();
  console.log("Comptroller deployed to:", Comptroller.address); // Returning the contract address 
  const WhitePaperInterestRateModel = await hre.ethers.getContractFactory("WhitePaperInterestRateModel");
  const whitePaperInterestRateModel = await WhitePaperInterestRateModel.deploy(BigInt(20000000000000000),BigInt(100000000000000000));
  console.log("whitePaperInterestRateModel deployed to:", whitePaperInterestRateModel.address);
    //deploying underlying DAI Token contract for local use
    const DaiContract = await hre.ethers.getContractFactory("Dai");
    const dai = await DaiContract.deploy(1);
    console.log("address of underlying dai tokens is",dai.address);
  // const dai = "0xaD6D458402F60fD3Bd25163575031ACDce07538D"
  
    //deploying cDAI Token markets
    //console.log("Deploying contracts with the following params:", Comptroller.address,whitePaperInterestRateModel.address,2.0e26,"Compound ETH","cETH",8,deployer.address);
    const CErc20Delegate = await hre.ethers.getContractFactory("CErc20Delegate");
    const cerc20delegate = await CErc20Delegate.deploy();
    console.log("cerc20delegate",cerc20delegate.address)
    const CErc20Delegator = await hre.ethers.getContractFactory("CErc20Delegator");
    // const CErc20Delegator = cErc20Delegator.deploy();
    // console.log("CErc20Delegator address",CErc20Delegator.address)
    console.log("compound dai contract is deployed by following params",dai,Comptroller.address,whitePaperInterestRateModel.address,BigInt(200000000000000000000000000),"Compound DAI","cDAI",8,deployer.address,cerc20delegate.address,"0x")
    cDaiContract = await CErc20Delegator.deploy(dai,Comptroller.address,whitePaperInterestRateModel.address,BigInt(200000000000000000000000000),"Compound DAI","cDAI",8,deployer.address,cerc20delegate.address,"0x");
    console.log("compound dai deployed to:", cDaiContract.address); 
  
  
    //deploying underlying USDT Token contract for local use
    const USDTContract = await hre.ethers.getContractFactory("USDT");
    const usdt = await USDTContract.deploy(100000000000,"Tether USD","USDT",6);
    // const usdt = "0x6EE856Ae55B6E1A249f04cd3b947141bc146273c";
    console.log("address of underlying usdc tokens is",usdt.address);
  
    //deploying USDT Token markets
    console.log("Deploying contracts with the following params:",Comptroller.address,whitePaperInterestRateModel.address,2.0e26,"Compound USDT","cUSDT",8,deployer.address);
    const cUSDTTokenContract = await CErc20Delegator.deploy(usdt,Comptroller.address,whitePaperInterestRateModel.address,BigInt(200000000000000000000000000),"Compound USDT","cUSDT",8,deployer.address,cerc20delegate.address,"0x");
    console.log("compound USDT deployed to:", cUSDTTokenContract.address); 
 })


describe("#Testing Comptroller Contract functions",()=>{

    it("It should ENTER LISTED MARKETS",async()=>{
        //const [deployer] = await ethers.getSigners();
       
        expect(('1000000').to.equal(BigNumber.from('1000000')));
       // await expect(unitroller.connect(deployer).enterMarkets([cTokenContract.address]).to.be.revertedWith(2));
      })
})