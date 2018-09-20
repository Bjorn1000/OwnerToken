var OwnerToken = artifacts.require("./OwnerToken.sol");

module.exports = function(deployer) {
  deployer.deploy(OwnerToken, 1000000);
};
