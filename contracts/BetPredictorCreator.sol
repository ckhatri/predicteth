pragma solidity >=0.4.21 <0.6.0;

import "./BetPredict.sol";

contract BetPredictorCreator {

  function createBet(uint256 betPrice, uint256 betAmount, uint256 deadline)
     public
     returns (address contractAddress)
  {
      // Create a new `BetPredict` contract and return its address.
      // From the JavaScript side, the return type is
      // `address`, as this is the closest type available in
      // the ABI.
      address newContract = address(new BetPredict(betPrice, betAmount, deadline));
      return newContract;
  }
}
