const Token = artifacts.require('Token');
const DBank = artifacts.require('DBank');

module.exports = async (deployer) => {
  await deployer.deploy(Token);
  const token = await Token.deployed();

  await deployer.deploy(DBank, token.address);
  const dbank = await DBank.deployed();

  await token.changeMinter(dbank.address);
};
