const hre = require("hardhat");
const parseUnits = require("ethers/lib/utils");
const deployErc20Token = require("@thenextblock/hardhat-erc20");
const deployCompoundV2 = require("@thenextblock/hardhat-compound");


async function main() {
  console.log("here starts main")
  const [deployer] = await hre.ethers.getSigners();
  const UNI_PRICE = "25022748000000000000";
  const USDC_PRICE = "1000000000000000000000000000000";

  // Deploy USDC ERC20
  const USDC = await deployErc20Token.deployErc20Token(
    {
      name: "USDC",
      symbol: "USDC",
      decimals: 6,
    },
    deployer
  );

  // Deploy UNI ERC20
  const UNI = await deployErc20Token.deployErc20Token(
    {
      name: "UNI",
      symbol: "UNI",
      decimals: 18,
    },
    deployer
  );

  const ctokenArgs = [
    {
      cToken: "cUNI",
      underlying: UNI.address,
      underlyingPrice: UNI_PRICE,
      collateralFactor: "500000000000000000", // 50%
    },
    {
      cToken: "cUSDC",
      underlying: USDC.address,
      underlyingPrice: USDC_PRICE,
      collateralFactor: "500000000000000000", // 50%
    },
  ];
console.log("before deploy compound2")
  const { comptroller, cTokens, priceOracle, interestRateModels } =
    await deployCompoundV2.deployCompoundV2(ctokenArgs, deployer);

  await comptroller._setCloseFactor(parseUnits("0.5", 18).toString());
  await comptroller._setLiquidationIncentive(parseUnits("1.08", 18));

  const { cUNI, cUSDC } = cTokens;

  console.log("Comptroller: ", comptroller.address);
  console.log("SimplePriceOralce: ", await comptroller.oracle());
  console.log("cUNI: ", cUNI.address);
  console.log("cUSDC: ", cUSDC.address);

  // Deploy Smartcontract
  const Compound = await ethers.getContractFactory("Compound");
  const compound = await Compound.deploy(comptroller.address);
  await compound.deployed();
  console.log("Compound deployed to:", compound.address);

  // Call public view function
  await compound.cTokens();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});