const AzuroBet = artifacts.require("AzuroBet");

module.exports = async function (deployer) {
  await deployer.deploy(AzuroBet);
};
