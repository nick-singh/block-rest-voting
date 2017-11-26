const contract = require('truffle-contract'),
Web3 = require('web3'),
provider = new Web3.providers.HttpProvider('http://localhost:8545'),
web3 = new Web3(provider),
fs = require('fs');


class VotingModel {
  constructor() {
    this.Voting = contract(JSON.parse(fs.readFileSync('../build/contracts/Voting.json', 'utf8')));
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

  voteForCandidate(name, data, callback){
    this.Voting.deployed().then(function(contractInstance) {
        contractInstance.voteForCandidate(name, data).then(function() {
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
