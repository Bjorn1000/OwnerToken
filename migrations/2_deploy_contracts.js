var OwnerToken = artifacts.require("./OwnerToken.sol");
var SafeMath = artifacts.require("./SafeMath.sol");


module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, OwnerToken);
  deployer.deploy(OwnerToken);
};
