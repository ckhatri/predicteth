App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets

    $('#create').on('submit', function(e){
      // validation code here
      App.betSize = $('#bet-size').val();
      App.price = $('eth-price').val();
      App.timestamp = $('timestamp').val();
      e.preventDefault();
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initCreateContract();
  },

  initCreateContract: function() {
    console.log('INIT!!');
    var BetPredictorCreatorContract = web3.eth.contract(
      [{"constant":false,"inputs":[{"name":"_myid","type":"bytes32"},{"name":"_result","type":"string"}],"name":"__callback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"deadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_myid","type":"bytes32"},{"name":"_result","type":"string"},{"name":"_proof","type":"bytes"}],"name":"__callback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ownerAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"ownerBet","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"deadlinePrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ownerBetConfirmed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"betPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"betAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"opponentBetConfirmed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"opponentAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"deadlinePriceRetrieved","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"becomeOpponent","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"hasPaymentHappened","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_betPrice","type":"uint256"},{"name":"_betAmount","type":"uint256"},{"name":"_deadline","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"nextStep","type":"string"}],"name":"LogConstructorInitiated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"price","type":"string"}],"name":"LogPriceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"description","type":"string"}],"name":"LogNewOraclizeQuery","type":"event"}]

    );

    console.log(BetPredictorCreatorContract)

    var BetPredictorCreator = BetPredictorCreatorContract.at('0x5a77ff100d514b00b9b24bbc1c99c0da45ac73aa');
    console.log(BetPredictorCreator);

    // $.getJSON('build/contracts/BetPredictorCreator.json', function(data) {
    //   console.log(data);
    //   // Get the necessary contract artifact file and instantiate it with truffle-contract
    //   var BetPredictorCreatorArtifact = data;
    //   console.log(BetPredictorCreatorArtifact);
    //   App.contracts.BetPredictorCreator = TruffleContract(BetPredictorCreatorArtifact);
    //
    //   // Set the provider for our contract
    //   App.contracts.BetPredictorCreator.setProvider(App.web3Provider);
    //
    //   // Use our contract to retrieve and mark the adopted pets
    //   console.log('hi there');
    //   console.log(App.contracts.BetPredictorCreator);
    // });

    return App.bindEvents();
  },


  bindEvents: function() {
    $(document).on('click', '#submit-create', App.handleAdopt);
  },

  test: function() {
    console.log(App.contracts);
    App.contracts.BetPredictorCreator.deployed().then(function(instance) {
      console.log(instance);
      return instance.test;
    })
  },

  handleAdopt: function(event) {
    event.preventDefault();

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      console.log(account)

      App.contracts.BetPredictorCreator.deployed().then((instance) => {
        console.log('sup');
        console.log(instance);
        console.log(App);
        instance.createBet.call(10, 10, 10, { from: account }).then((addr) => {
          const addrCreated = addr;
          instance.createBet(10, 10, 10, { from: account }).then(() => {
            console.log(addrCreated);
            alert('congrats your smart contract was created at address: ' + addrCreated);
          });
        });
      });

      // App.contracts.Adoption.deployed().then(function(instance) {
      //   adoptionInstance = instance;
      //
      //   // Execute adopt as a transaction by sending account
      //   return adoptionInstance.adopt(petId, {from: account});
      // }).then(function(result) {
      //   return App.markAdopted();
      // }).catch(function(err) {
      //   console.log(err.message);
      // });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
