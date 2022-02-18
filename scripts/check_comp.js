const hre = require("hardhat");


async function main() {
const CompAddress = "0xf76D4a441E4ba86A923ce32B89AFF89dBccAA075";
  const CompAbi = require("../abi/Comp.json");
  const Comp = new hre.ethers.Contract(
    CompAddress,
    CompAbi,
    ethers.provider.getSigner()
  );
  const CompoundLensAddress = "0xA9ddAb1032F224B510f7Bf002E0E75BA49E78755";
  const CompoundLensAbi = require("../abi/CompoundLens.json");
  const CompoundLens = new hre.ethers.Contract(
    CompoundLensAddress,
    CompoundLensAbi,
    ethers.provider.getSigner()
  );
  console.log("Comp balance",Comp.address);
  console.log("Comp balance of the address is ",await Comp.balanceOf("0x4c520f09A9e4F294Eb639E64cb51c46dCB9785dd"));
  console.log("Comp balance from lens",await CompoundLens.connect(ethers.provider.getSigner()).callStatic.getCompBalanceMetadataExt("0xf76D4a441E4ba86A923ce32B89AFF89dBccAA075","0xcfa7b0e37f5AC60f3ae25226F5e39ec59AD26152","0x4c520f09A9e4F294Eb639E64cb51c46dCB9785dd"))
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });