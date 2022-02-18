const { expect } = require("chai");
const { ethers } = require("hardhat");
const BigNumber = ethers.BigNumber;

describe("#3Testing Comptroller", () => {
  const ComptrollerAddress = "0x2F37D170503b0b9Aacf629aD5C6117F7569aF920";
  const ComptrollerAbi = require("../abi/Comptroller.json");
  const Comptroller = new hre.ethers.Contract(
    ComptrollerAddress,
    ComptrollerAbi,
    ethers.provider.getSigner()
  );
  console.log("Comptoller address is", Comptroller.address);
  const UnitrollerAddress = "0xcfa7b0e37f5AC60f3ae25226F5e39ec59AD26152";
  const UnitrollerAbi = require("../abi/Comptroller.json");
  const Unitroller = new hre.ethers.Contract(
    UnitrollerAddress,
    UnitrollerAbi,
    ethers.provider.getSigner()
  );
  console.log("Unitroller address is", Unitroller.address);
  //ethers.provider.getSigner()
  it("It should revert when entering markets not listed ", async() => {
    try{
   await Unitroller.connect(
      ethers.provider.getSigner()
    ).enterMarkets(["0x042d033c0b778bb236b74c09f55691fe275a823e"]);
   }catch(error){
    assert.fail(0, 1, error)
   }
    //const enteringMarketTxn = await enteringMarket.wait();
    //console.log("entering markets txn", enteringMarketTxn);
  }).timeout('40s');

  it("should not allow to exit market when user has outstanding borrow balance in the asset",()=>{
    
  })
});
