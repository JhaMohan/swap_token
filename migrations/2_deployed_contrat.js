const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token")

module.exports = async function(deployer) {
  
  //token contract
  await deployer.deploy(Token);
  const token = await Token.deployed();

  const balance = await token.totalSupply()

  //TokenExchange contract
  await deployer.deploy(EthSwap,token.address);
  const ethSwap = await EthSwap.deployed();



  await token.transfer(ethSwap.address,balance)
};
