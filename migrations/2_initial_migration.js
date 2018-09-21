var Motion = artifacts.require("./Motion.sol");
var OwnerToken = artifacts.require("./OwnerToken.sol");
module.exports = function(deployer) {
  deployer.deploy(OwnerToken, 1000000).then(function() {
    return deployer.deploy(Motion, OwnerToken.address);
  });
};
