const { expect } = require("chai");
const { ethers } = require("hardhat");
const BigNumber = ethers.BigNumber;

describe("#2Borrow assets from compound protocol", () => {
  const cDaiAddress = "0xbc689667c13fb2a04f09272753760e38a95b998c";
  const cDaiAbi = require("../abi/CDai.json");
  const cDaiToken = new hre.ethers.Contract(
    cDaiAddress,
    cDaiAbi,
    ethers.provider.getSigner()
  );
  console.log("cDai Address is", cDaiToken.address);

  //dai
  const DaiAddress = "0x31F42841c2db5173425b5223809CF3A38FEde360";
  const DaiAbi = require("../abi/Dai.json");
  const DaiToken = new hre.ethers.Contract(
    DaiAddress,
    DaiAbi,
    ethers.provider.getSigner()
  );
  console.log("Dai address is", DaiToken.address);

  //cusdt
  const cUSDTAddress = "0xf6958cf3127e62d3eb26c79f4f45d3f3b2ccded4";
  const cUSDTAbi = require("../abi/cUSDT.json");
  const cUSDTToken = new hre.ethers.Contract(
    cUSDTAddress,
    cUSDTAbi,
    ethers.provider.getSigner()
  );
  console.log("cUSDTToken address is", cUSDTToken.address);

  //   before('get necessary contracts',async()=>{
  //     //getting Comptroller
  const UnitrollerAddress = "0xcfa7b0e37f5AC60f3ae25226F5e39ec59AD26152";
  const UnitrollerAbi = require("../abi/Comptroller.json");
  const Unitroller = new hre.ethers.Contract(
    UnitrollerAddress,
    UnitrollerAbi,
    ethers.provider.getSigner()
  );
  console.log("Comptoller address is", Unitroller.address);


  it("it should allow borrowing from compound protocol", async () => {
    //approve dai
    // await DaiToken.connect(ethers.provider.getSigner()).approve(
    //   cDaiToken.address,
    //   "999999999999999999999999999999999"
    // );
    //supplying 0.1 DAI
    // let mintAmount = 100000000000000000;
    // let mintedToken = await cDaiToken
    //   .connect(ethers.provider.getSigner())
    //   .mint(BigInt(mintAmount));
    // console.log("mintedToken is", mintedToken);
    // let mintedTxn = await mintedToken.wait();
    // let mintcDAIAmount = mintedTxn.events.find((x) => x.event == "Mint").args.mintTokens;
    // console.log("minted cDAI Amount", mintcDAIAmount);
    //should enter DAI market to enable dai as collateral for borrowing USDT
    // const markets = [];
    // markets.push(cDaiToken.address);
    // console.log("markets", markets);
    // const enteringMarket = await Unitroller.connect(ethers.provider.getSigner()).enterMarkets(markets);
    // const enteringMarketTxn = await enteringMarket.wait();
    // console.log("entering markets txn",enteringMarketTxn)
   // let cTokenMarketEntered = enteringMarketTxn.events.find((x)=>x.event == "MarketEntered").args.cToken;
   // console.log("market entered ctoken",cTokenMarketEntered);
    //console.log("cDaiToken address",cDaiToken.address);
    //expect((cTokenMarketEntered).to.equal("0xbc689667c13fb2a04f09272753760e38a95b998c"));

    //borrowing 1 USDT
    let borrowAmount = 1000000;
    let borrowToken = await cUSDTToken.connect(ethers.provider.getSigner())
    .borrow(BigInt(borrowAmount));
    let borrowTxn = await borrowToken.wait();
    console.log("borrowTxn",borrowTxn)
    let borrowcUSDTAmount = borrowTxn.events.find((x) => x.event == "Borrow").args.borrowAmount;
    console.log("borrowcUSDTAmount",parseInt(borrowcUSDTAmount));
    expect(borrowcUSDTAmount).to.equal(BigNumber.from('1000000'));

    
  }).timeout('400s');

 
  it("should allow repaying the borrow",async()=>{
    let repayBorrowAmount = 1000000;
    let repayBorrowToken = await cUSDTToken.connect(ethers.provider.getSigner())
    .repayBorrow(BigInt(repayBorrowAmount));
    let repayBorrowTxn = await repayBorrowToken.wait();
    console.log("repay borrowTxn",repayBorrowTxn)
    let repayBorrowcUSDTAmount = repayBorrowTxn.events.find((x) => x.event == "RepayBorrow").args.repayAmount;
    console.log("borrowcUSDTAmount",parseInt(repayBorrowcUSDTAmount));
    expect(repayBorrowcUSDTAmount).to.equal(BigNumber.from('1000000'));
  }).timeout('400s');
  
});
