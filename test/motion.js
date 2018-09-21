var Motion = artifacts.require("./Motion.sol");

contract("Motion", function(accounts) {
    var motionInstance;
    it("initializes with two options", function() {
        return Motion.deployed().then(function(instance) {
            return instance.optionsCount();
        }).then(function(count) {
            assert.equal(count, 2);
        });
    });

    it("it initializes the options with the correct values", function() {
        return Motion.deployed().then(function(instance) {
          motionInstance = instance;
          return motionInstance.options(1);
        }).then(function(option) {
            assert.equal(option[0], 1, "contains the correct id");
            assert.equal(option[1], "Yes", "contains the correct name");
            assert.equal(option[2], 0, "contains the correct votes count");
          return motionInstance.options(2);
        }).then(function(option) {
            assert.equal(option[0], 2, "contains the correct id");
            assert.equal(option[1], "No", "contains the correct name");
            assert.equal(option[2], 0, "contains the correct votes count");
        });
      });

      it("allows a voter to cast a vote", function() {
        return Motion.deployed().then(function(instance) {
          motionInstance = instance;
          optionId = 1;
          return motionInstance.vote(optionId, { from: accounts[0] });
        }).then(function(receipt) {
          return motionInstance.voters(accounts[0]);
          return motionInstance.voters(accounts[0]);
        }).then(function(voted) {
          assert(voted, "the voter was marked as voted");
          return motionInstance.options(optionId);
        }).then(function(option) {
          var voteCount = option[2];
          assert.equal(voteCount, 1, "increments the option's vote count");
        })
      });

      it("throws an exception for invalid candiates", function() {
        return Motion.deployed().then(function(instance) {
          motionInstance = instance;
          return motionInstance.vote(99, { from: accounts[1] })
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
          return motionInstance.options(1);
        }).then(function(option1) {
          var voteCount = option1[2];
          assert.equal(voteCount, 1, "option 1 did not receive any votes");
          return motionInstance.options(2);
        }).then(function(option2) {
          var voteCount = option2[2];
          assert.equal(voteCount, 0, "option 2 did not receive any votes");
        });
      });
      
}); 

