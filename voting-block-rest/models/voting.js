const contract = require('truffle-contract'),
Web3 = require('web3'),
provider = new Web3.providers.HttpProvider('http://localhost:8545'),
web3 = new Web3(provider),
fs = require('fs');


class VotingModel {
  constructor() {
    this.Voting = contract(JSON.parse(fs.readFileSync('./build/contracts/Voting.json', 'utf8')));
    this.Voting.setProvider(provider);
  }

  getVotes(name, callback){
    this.Voting.deployed().then(function(contractInstance) {
      contractInstance.totalVotesFor.call(name).then(function(v) {
        let result = {
          name:name,
          votes:v.toString()
        };
        callback(result);
      });
    });
  }

  getBalance(callback){
    this.Voting.deployed().then(function(contractInstance) {
      web3.eth.getBalance(contractInstance.address, function(error, result) {
        callback(web3.fromWei(result.toString()));
      });
    });
  }

  buyTokens(address, tokensToBuy, callback){
    this.Voting.deployed().then(function(contractInstance){
      contractInstance.buy({value: web3.toWei(tokensToBuy, 'ether'), from: address}).then(function(tokens){
        web3.eth.getBalance(contractInstance.address, function(error, result) {
          callback(web3.fromWei(result.toString()));
        });
      });
    });
  }

  voterDetails(address, callback){
    this.Voting.deployed().then(function(contractInstance){
      contractInstance.voterDetails.call(address).then(function(v) {
        callback(v.toString());
      });
    });
  }

  totalTokens(callback){
    this.Voting.deployed().then(function(contractInstance){
      contractInstance.totalTokens().then(function(tokens){
        callback(tokens.toString());
      });
    });
  }

  tokensSold(callback){
    this.Voting.deployed().then(function(contractInstance){
      contractInstance.tokensSold().then(function(tokens){
        callback(tokens.toString());
      });
    });
  }

  tokenPrice(callback){
    this.Voting.deployed().then(function(contractInstance){
      contractInstance.tokenPrice().then(function(tokens){
        callback(tokens.toString());
      });
    });
  }

  voteForCandidate(name, data, callback){
    const {tokens} = data,
    d = {gas:data.gas, from:data.from};
    this.Voting.deployed().then(function(contractInstance) {
        contractInstance.voteForCandidate(name, tokens, d).then(function() {
          return contractInstance.totalVotesFor.call(name).then(function(v) {
            let result = {
              name:name,
              votes:v.toString()
            };
            callback(result);
          });
        });
      });
  }


}

module.exports = VotingModel;
