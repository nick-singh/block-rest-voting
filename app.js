const express = require('express'),
app = express(),
bodyParser = require('body-parser'),
contract = require('truffle-contract'),
Web3 = require('web3'),
provider = new Web3.providers.HttpProvider('http://localhost:8545'),
web3 = new Web3(provider),
fs = require('fs');

app.use(bodyParser.json());

var Voting = contract(JSON.parse(fs.readFileSync('./build/contracts/Voting.json', 'utf8')));
Voting.setProvider(provider);
let candidates = {"Rama": "candidate-1", "Nick": "candidate-2", "Jose": "candidate-3"};
let candidateNames = Object.keys(candidates);


function getVotes (name, callback) {
  Voting.deployed().then(function(contractInstance) {
    contractInstance.totalVotesFor.call(name).then(function(v) {
      let result = {
        name:name,
        votes:v.toString()
      };
      callback(result);
    });
  });
}

//{gas: 140000, from: web3.eth.accounts[0]}

function voteForCandidate(name, data, callback){
  Voting.deployed().then(function(contractInstance) {
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

app.get('/vote/count/:name', function (req, res) {
  getVotes(req.params.name, function(votes){
    res.send(votes);
  });
});

app.put('/vote/count/:name', function (req, res, next) {
  voteForCandidate(req.params.name, req.body, function(votes){
    res.send(votes);
  })
});



app.listen(3000, () => console.log('Example app listening on port 3000!'))
