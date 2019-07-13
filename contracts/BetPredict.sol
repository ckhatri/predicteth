pragma solidity >=0.4.21 <0.6.0;

import "./SafeMath.sol";
import "./oracalizeApi.sol";

contract BetPredict is usingOraclize {
  using SafeMath for uint;

  uint256 public betPrice;
  uint256 public deadlinePrice;
  uint256 public betAmount;
  uint256 public priceLimit;
  uint256 public deadline;

  address payable public ownerAddress;
  address payable public opponentAddress;

  bool public hasPaymentHappened;
  bool public ownerBetConfirmed;
  bool public opponentBetConfirmed;
  bool public deadlinePriceRetrieved;

  event LogConstructorInitiated(string nextStep);
  event LogPriceUpdated(string price);
  event LogNewOraclizeQuery(string description);

  constructor( uint256 _betPrice, uint256 _betAmount, uint256 _deadline) public {
		betPrice = _betPrice;
    betAmount = _betAmount;
    deadline = _deadline;

    ownerAddress = msg.sender;
    _updatePrice();
	}

  modifier requireOpponentBetNotMade() {
    require(!opponentBetConfirmed);
    _;
  }

  modifier requireOwnerBetNotMade() {
    require(!ownerBetConfirmed);
    _;
  }

  function becomeOpponent() public payable requireOpponentBetNotMade {
    require(msg.sender != address(ownerAddress));
    require(msg.value == betAmount);
    opponentAddress = msg.sender;
    opponentBetConfirmed = true;
  }

  function ownerBet() public payable requireOwnerBetNotMade {
    require(msg.sender == address(ownerAddress));
    require(msg.value == betAmount);

    ownerBetConfirmed = true;
  }

  function getTime() public view returns (uint256) {
		return now;
	}

  function withdraw() public {
		require(getTime() > deadline);
    require(!hasPaymentHappened);
    if (deadlinePriceRetrieved) {
      require(getTime() > deadline);
      require(!hasPaymentHappened);
      require(ownerBetConfirmed && opponentBetConfirmed);
      if (deadlinePrice >= betPrice) {
        ownerAddress.transfer(address(this).balance);
      } else {
        opponentAddress.transfer(address(this).balance);
      }
      hasPaymentHappened = true;
    } else {
      if (msg.sender == address(ownerAddress)) {
        ownerAddress.transfer(betPrice);
        ownerBetConfirmed = false;
      } else if (msg.sender == address(opponentAddress)) {
        opponentAddress.transfer(betPrice);
        opponentBetConfirmed = false;
      }
    }
	}

  function _callback(bytes32 myid, string memory result) private {
        if (msg.sender != oraclize_cbAddress()) revert();
        deadlinePrice = safeParseInt(result);
        deadlinePriceRetrieved = true;
        emit LogPriceUpdated(result);
    }

  function _updatePrice() private {
        deadlinePrice = 0;
    }
}
