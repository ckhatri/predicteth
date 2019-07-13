var BetPredictorCreator = artifacts.require("BetPredictorCreator");
console.log(BetPredictorCreator);

module.exports = function(deployer) {
  deployer.deploy(BetPredictorCreator);
};
