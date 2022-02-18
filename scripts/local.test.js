//test case for comptroller

const hre = require("hardhat");
const { expect } = require("chai");
const { ethers } = require("hardhat");


let unitroller;
let deployer;
let comptroller;
let usdt;

    beforeEach(async () => {
        await hre.run("compile");
        const [deployer,user1] = await ethers.getSigners();
        console.log("Deploying contracts with the account:", deployer.address);
    
        //#SUPPLYING ASSETS TO COMPOUND#//
        console.log(
          "###################SUPPLYING ASSETS TO COMPOUND#################################"
        );
        const Comptroller = await hre.ethers.getContractFactory("Comptroller");
        const comptroller = await Comptroller.deploy();
    
        console.log("Comptroller deployed to:", comptroller.address); // Returning the comptroller address
    
        const Unitroller = await hre.ethers.getContractFactory("Unitroller");
        unitroller = await Unitroller.deploy();
        console.log("Unitroller deployed to:", unitroller.address); //
    
        const WhitePaperInterestRateModel = await hre.ethers.getContractFactory(
          "WhitePaperInterestRateModel"
        );
        const whitePaperInterestRateModel =
          await WhitePaperInterestRateModel.deploy(
            BigInt(20000000000000000),
            BigInt(100000000000000000)
          );
        console.log(
          "whitePaperInterestRateModel deployed to:",
          whitePaperInterestRateModel.address
        );
        const CErc20Delegate = await hre.ethers.getContractFactory(
          "CErc20Delegate"
        );
        const cerc20delegate = await CErc20Delegate.deploy();
        const CErc20Delegator = await hre.ethers.getContractFactory(
          "CErc20Delegator"
        );
        //deploying underlying DAI Token contract for local use
        const DaiContract = await hre.ethers.getContractFactory("Dai");
        const dai = await DaiContract.deploy(1);
        console.log("address of underlying dai tokens is", dai.address);
    
        //deploying DAI Token 
        const cDaiTokenContract = await CErc20Delegator.deploy(
          dai.address,
          comptroller.address,
          whitePaperInterestRateModel.address,
          BigInt(200000000000000000000000000),
          "Compound DAI",
          "cDAI",
          8,
          deployer.address,
          cerc20delegate.address,
          "0x"
        );
        console.log("compound dai deployed to:", cDaiTokenContract.address);
        //deploying underlying USDT Token contract for local use
        const USDTContract = await hre.ethers.getContractFactory("USDT");
        usdt = await USDTContract.deploy(
          100000000000,
          "Tether USD",
          "USDT",
          6
        );
        console.log("usdt address is", usdt.address);
    
        //deploying USDT Token 
        console.log(
          "Deploying contracts with the following params:",
          comptroller.address,
          whitePaperInterestRateModel.address,
          2.0e26,
          "Compound USDT",
          "cUSDT",
          8,
          deployer.address
        );
        const cUSDTTokenContract = await CErc20Delegator.deploy(
          usdt.address,
          comptroller.address,
          whitePaperInterestRateModel.address,
          BigInt(200000000000000000000000000),
          "Compound USDT",
          "cUSDT",
          8,
          deployer.address,
          cerc20delegate.address,
          "0x"
        );
        console.log("compound USDT deployed to:", cUSDTTokenContract.address);
    
        //adding dai to support market
        // const daisupportMarket = await comptroller._supportMarket(
        //   cDaiTokenContract.address
        // );
        // console.log("support market dai", daisupportMarket);
        // const daisupportedReceipt = await daisupportMarket.wait();
        // console.log("market supported event dai", daisupportedReceipt);
        const enteringMarket = await comptroller.connect(deployer).enterMarkets([usdt.address]);
        const txn = await enteringMarket.wait();

        console.log("txn####################",txn);
      });
  describe("Testing comptroller Functions",async () => {
      it("It should revert if market is not listed in comptroller",async()=>{
        const [deployer] = await ethers.getSigners();
       
        expect(('1000000').to.equal(BigNumber.from('1000000')));
       // await expect(unitroller.connect(deployer).enterMarkets([usdt.address]).to.be.revertedWith(2));
      })
      it("It should not allow to exit market when borrow limit used is 80%",async()=>{
        
      })
    
  });

