const { expect } = require("chai");
const { ethers } = require("hardhat");
const BigNumber = ethers.BigNumber;


//supply 1 DAI to compound protocol
//1-enable the token to supply or repay to compound protocol
//2-supply 1 DAI --> mintAmount:1000000000000000000
//3-get minted cDAI
//exchange rate should be calculated first
//minted cDai should be equal to product of 

describe('#1Supply assets to Compound protocol',()=>{

    before('get necessary contracts',async()=>{
      //getting Comptroller
        const ComptrollerAddress = "0x2F37D170503b0b9Aacf629aD5C6117F7569aF920";
        const ComptrollerAbi = require("../abi/Comptroller.json");
        const Comptroller = new hre.ethers.Contract(ComptrollerAddress,ComptrollerAbi,ethers.provider.getSigner());
        console.log("Comptoller address is",Comptroller.address)

        //getting whitepaperInterestModel
        const WhitePaperInterestRateModelAddress = "0xFe6e06a5219707e44817922141C20b3392150e81";
        const WhitePaperInterestRateModelAbi = require("../abi/WhitePaperInterestRateModel.json");
        const WhitePaperInterestRateModel = new hre.ethers.Contract(WhitePaperInterestRateModelAddress,WhitePaperInterestRateModelAbi,ethers.provider.getSigner());
        console.log("WhitePaper Interest Rate Model,",WhitePaperInterestRateModel);
        //cdai 
        const cDaiAddress = "0xbc689667c13fb2a04f09272753760e38a95b998c";
        const cDaiAbi = require("../abi/CDai.json");
        const cDaiToken = new hre.ethers.Contract(cDaiAddress,cDaiAbi,ethers.provider.getSigner());
        console.log("cDai Address is",cDaiToken.address);

        //dai 
        const DaiAddress = "0x31F42841c2db5173425b5223809CF3A38FEde360";
        const DaiAbi = require("../abi/Dai.json");
        const DaiToken = new hre.ethers.Contract(DaiAddress,DaiAbi,ethers.provider.getSigner());
        console.log("Dai address is",DaiToken.address);
    })
    it("Should mint cTokens when supplying assets to compound protocol",async function () {


      // //will be removed
      // const ComptrollerAddress = "0x2F37D170503b0b9Aacf629aD5C6117F7569aF920";
      // const ComptrollerAbi = require("../abi/Comptroller.json");
      // const Comptroller = new hre.ethers.Contract(ComptrollerAddress,ComptrollerAbi,ethers.provider.getSigner());
      // //++console.log("Comptoller address is",Comptroller.address)

      // //getting whitepaperInterestModel
      // const WhitePaperInterestRateModelAddress = "0xFe6e06a5219707e44817922141C20b3392150e81";
      // const WhitePaperInterestRateModelAbi = require("../abi/WhitePaperInterestRateModel.json");
      // const WhitePaperInterestRateModel = new hre.ethers.Contract(WhitePaperInterestRateModelAddress,WhitePaperInterestRateModelAbi,ethers.provider.getSigner());
      // console.log("WhitePaper Interest Rate Model,",WhitePaperInterestRateModel);
      //cdai 
      const cDaiAddress = "0xbc689667c13fb2a04f09272753760e38a95b998c";
      const cDaiAbi = require("../abi/CDai.json");
      const cDaiToken = new hre.ethers.Contract(cDaiAddress,cDaiAbi,ethers.provider.getSigner());
      console.log("cDai Address is",cDaiToken.address);

      //dai 
      const DaiAddress = "0x31F42841c2db5173425b5223809CF3A38FEde360";
      const DaiAbi = require("../abi/Dai.json");
      const DaiToken = new hre.ethers.Contract(DaiAddress,DaiAbi,ethers.provider.getSigner());
      console.log("Dai address is",DaiToken.address);


      //cusdt
      const cUSDTAddress = "0x135669c2dcbd63f639582b313883f101a4497f76"
      const cUSDTAbi = require("../abi/cUSDT.json");
      const cUSDTToken = new hre.ethers.Contract(cUSDTAddress,cUSDTAbi,ethers.provider.getSigner());
      console.log("cUSDTToken address is",cUSDTToken.address);



      //will be removed
      //console.log("DAI Balance of my wallet",await DaiToken.balanceOf("0xAFec3221bEab07cf2a1C97168d26Bf99209610BF"));
      await DaiToken.connect(ethers.provider.getSigner()).approve(cDaiToken.address, '999999999999999999999999999999999');
      //supplying 2 DAI 
      
      let mintAmount = 2000000000000000000;
      let mintAmountEth = 2;
      let exchangeRateCurrent = await cDaiToken.exchangeRateStored();
      console.log("exchange rate stored cdai",exchangeRateCurrent);
      let mantissa =  BigNumber.from(10).pow(28);
      //let exchangeRateMantissa = (ethers.BigNumber.from(mantissa).div(exchangeRateCurrent));
      //console.log("exchange rate mantissa is",exchangeRateMantissa);
      let mintedToken = await cDaiToken.connect(ethers.provider.getSigner()).mint(BigInt(mintAmount));
      console.log("mintedToken is",mintedToken);
      let mintedTxn = await mintedToken.wait();

      //amount = (res.events.find(x => x.event == 'withdrawn').args.amount)
      //let mintcAmount = (mintedTxn.events.find(x => x.event == 'Mint').args.mintTokens).div(Math.pow(10,8));
      let mintcAmount = ((mintedTxn.events.find(x => x.event == 'Mint').args.mintTokens));
      console.log("mintcAmount",(mintcAmount));
      let mintedCAmount = (mintcAmount.div(Math.pow(10,8)));
      console.log("mintedCAmount",mintedCAmount);
     
      //let mantissa = 18+18-8;//28
      
      let cAmount = ethers.BigNumber.from(ethers.BigNumber.from(mintAmountEth).mul(mantissa).div(exchangeRateCurrent));
      console.log("cAmount calculated",cAmount)
      //expect(parseInt(mintcAmount)).to.be.greaterThan(0);
      expect(cAmount).to.be.equal(mintedCAmount);



    }).timeout('400s');

    it("should allow redeem underlying tokens",async()=>{
      //redeeming 1 DAI
      let redeemAmount = 1000000000000000000;
            //cdai 
            const cDaiAddress = "0xbc689667c13fb2a04f09272753760e38a95b998c";
            const cDaiAbi = require("../abi/CDai.json");
            const cDaiToken = new hre.ethers.Contract(cDaiAddress,cDaiAbi,ethers.provider.getSigner());
            console.log("cDai Address is",cDaiToken.address);
      
            //dai 
            const DaiAddress = "0x31F42841c2db5173425b5223809CF3A38FEde360";
            const DaiAbi = require("../abi/Dai.json");
            const DaiToken = new hre.ethers.Contract(DaiAddress,DaiAbi,ethers.provider.getSigner());
            console.log("Dai address is",DaiToken.address);
      
      
            //cusdt
            const cUSDTAddress = "0x135669c2dcbd63f639582b313883f101a4497f76"
            const cUSDTAbi = require("../abi/cUSDT.json");
            const cUSDTToken = new hre.ethers.Contract(cUSDTAddress,cUSDTAbi,ethers.provider.getSigner());
            console.log("cUSDTToken address is",cUSDTToken.address);
      let redeemUnderlyingToken = await cDaiToken.connect(ethers.provider.getSigner())
    .redeemUnderlying(BigInt(redeemAmount));
    let redeemUnderlyingTxn = await redeemUnderlyingToken.wait();
    console.log("redeem underlying",redeemUnderlyingTxn)
    let redeemUnderlyingAmount = redeemUnderlyingTxn.events.find((x) => x.event == "Redeem").args.redeemAmount;
    console.log("redeemUnderlyingAmount",parseInt(redeemUnderlyingAmount));
    expect(redeemUnderlyingAmount).to.equal(BigNumber.from('1000000000000000000'));
    }).timeout('400s');
    //it("Should accumulate interest based on the current Supply Rate for the asset",async function(){})
    it("Should accrue COMP when supplying assets to compound protocol",async function(){
      
      const ComptrollerAddress = "0x2F37D170503b0b9Aacf629aD5C6117F7569aF920";
      const ComptrollerAbi = require("../abi/Comptroller.json");
      const Comptroller = new hre.ethers.Contract(ComptrollerAddress,ComptrollerAbi,ethers.provider.getSigner());
      console.log("Comptoller address is",Comptroller.address)
    })
    //it("Should accrue COMP when borrowing asset from compound protocol",async function(){})

})



