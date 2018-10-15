var OwnerToken = artifacts.require("./OwnerToken.sol");
var SafeMath = artifacts.require("./SafeMath.sol");
var Proposal = artifacts.require("./Proposal.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, OwnerToken);
  deployer.deploy(OwnerToken).then(function() {
    return deployer.deploy(Proposal, OwnerToken.address);
  });
};
