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
  await hre.run('compile');
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address); 


  //#SUPPLYING ASSETS TO COMPOUND#//
  console.log("###################SUPPLYING ASSETS TO COMPOUND#################################")
  const Comptroller = await hre.ethers.getContractFactory("Comptroller");
  const comptroller = await Comptroller.deploy();

 

  console.log("Comptroller deployed to:", comptroller.address); // Returning the contract address 
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


  //deploying underlying USDT Token contract for local use
  const USDTContract = await hre.ethers.getContractFactory("USDT");
  const usdt = await USDTContract.deploy(100000000000,"Tether USD","USDT",6);
  console.log("address of underlying usdc tokens is",usdt.address);
  //deploying USDT Token markets
  console.log("Deploying contracts with the following params:", comptroller.address,whitePaperInterestRateModel.address,2.0e26,"Compound USDT","cUSDT",8,deployer.address);
  const cUSDTTokenContract = await CErc20Delegator.deploy(usdt.address,comptroller.address,whitePaperInterestRateModel.address,BigInt(200000000000000000000000000),"Compound USDT","cUSDT",8,deployer.address,cerc20delegate.address,"0x");
  console.log("compound USDT deployed to:", cUSDTTokenContract.address); 


  //deploying underlying UNI Token contract for local use
  const UniswapContract = await hre.ethers.getContractFactory("Uni");
  const Uniswap = await UniswapContract.deploy(deployer.address,deployer.address,1644388140);
  console.log("address of underlying UNISWAP tokens is",Uniswap.address);
  //deploying Uniswap Token markets
  console.log("Deploying contracts with the following params:", comptroller.address,whitePaperInterestRateModel.address,2.0e26,"Compound Uniswap","cUniswap",8,deployer.address);
  const cUniswapTokenContract = await CErc20Delegator.deploy(Uniswap.address,comptroller.address,whitePaperInterestRateModel.address,BigInt(200000000000000000000000000),"Compound Uniswap","cUniswap",8,deployer.address,cerc20delegate.address,"0x");
  console.log("compound Uniswap deployed to:", cUniswapTokenContract.address); 

  //adding dai to support market
  const daisupportMarket = await comptroller._supportMarket(cDaiTokenContract.address);
  console.log("support market dai",daisupportMarket)
  const daisupportedReceipt = await daisupportMarket.wait();
  console.log("market supported event dai",daisupportedReceipt);


  //adding usdt to support market
  const usdtsupportMarket = await comptroller._supportMarket(cUSDTTokenContract.address);
  console.log("support market usdt",usdtsupportMarket)
  const usdtsupportedReceipt = await usdtsupportMarket.wait();
  console.log("market supported event usdt",usdtsupportedReceipt);
  // supportedReceipt.then(function(res){
  //   console.log("pending result for support",res)
  // })

  //adding uni to support market
  const uniswapsupportMarket = await comptroller._supportMarket(cUniswapTokenContract.address);
  console.log("support market uniswap",uniswapsupportMarket)
  const uniswapsupportedReceipt = await uniswapsupportMarket.wait();
  console.log("market supported event uniswap",uniswapsupportedReceipt);

  //approve compound bat to access user wallet
  const approval = await dai.approve(cDaiTokenContract.address,BigInt(5000000000000000000));
  console.log("approval is",approval)
  //mint some dai to account

  //const exchangeRateCurrent = await cDaiTokenContract.exchangeRateCurrent();
  //console.log("exchange rate current",exchangeRateCurrent.data)
  const minted = await dai.mint(deployer.address,BigInt(1000000000000000000));
  console.log("minted",minted);


  //const balanceOfUnderlying = await cDaiTokenContract.balanceOfUnderlying(deployer.address);
  //console.log("balance of underlying",balanceOfUnderlying)
  //transfer minted dai to compound
  const cDaiMinted =  await cDaiTokenContract.mint(BigInt(1000000000000000000));
  console.log("cdai mintd",cDaiMinted);
  const cDaiMintedReceipt = await cDaiMinted.wait();
  console.log("cdai minted events.....................",cDaiMintedReceipt.events[0])
 // console.log("cdai minted events.....................",cDaiMintedReceipt.events)

  console.log("balance of cDai of user")
  const cDaiBalance = await cDaiTokenContract.balanceOf(deployer.address);
  console.log("balance is",cDaiBalance)
  //const getAssetsInC = await comptroller.getAssetsIn(deployer.address);
  //console.log("get assets in",getAssetsInC)
console.log("when enabling an asset as collateral,the user have to enter its market");
const markets = [];
markets.push(cDaiTokenContract.address);
console.log("markets",markets)
  const enteringMarket = await comptroller.enterMarkets(markets);
  const txn = await enteringMarket.wait();
  console.log("txn####################",txn.events)
  const getAccountSnapshot = await cDaiTokenContract.getAccountSnapshot(deployer.address);
  console.log(" getAccountSnapshot for account",getAccountSnapshot);

  const getAssetsIn = await comptroller.getAssetsIn(deployer.address);
  console.log("get assets in",getAssetsIn)
   //#BORROWING ASSETS FROM COMPOUND#//
   console.log("###################BORROWING ASSETS FROM COMPOUND#################################")
 console.log("cUSDT token address is",cUniswapTokenContract.address)
  console.log("borrowing 1000000 uniswap")
  try{
    borrowUniswapTokenContract = await cUniswapTokenContract.borrow(BigInt(100000));
    console.log("borrowing uniswap token",borrowUniswapTokenContract)
  }catch(err){
    console.log("error is",err)
  }
 // borrowUniswapTokenContract = await cUniswapTokenContract.borrow(100000);
  

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
