const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token")

module.exports = async function(deployer) {
  //TokenExchange contract
  await deployer.deploy(EthSwap);
  const ethSwap = await EthSwap.deployed();

  //token contract
  await deployer.deploy(Token);
  const token = await Token.deployed();

  const balance = await token.totalSupply()

  await token.transfer(ethSwap.address,balance)
};
