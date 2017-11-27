const express = require('express'),
router = express.Router(),
VotingModel = require('../models/voting'),
voting = new VotingModel();


router.get('/votes/count/:name', function(req, res, next) {
  voting.getVotes(req.params.name, function(votes){
    res.send(votes);
  });
});

router.get('/votes/tokens/balance', function(req, res, next){
  voting.getBalance(function(balance){
    res.send(balance);
  });
});

router.get('/votes/tokens/:address/:quantity', function(req, res, next){
  voting.buyTokens(req.params.address, req.params.quantity, function(balance){
    res.send(balance);
  })
});

router.get('/votes/candidate/details/:address', function(req, res, next){
  voting.voterDetails(req.params.address, function(details){
    res.send(details);
  });
});

router.get('/votes/tokens/total', function(req, res, next){
  voting.totalTokens(function(tokens){
    res.send(tokens);
  });
});

router.get('/votes/tokens', function(req, res, next){
  voting.tokensSold(function(tokens){
    res.send(tokens);
  });
});

router.get('/votes/tokens/price', function(req, res, next){
  voting.tokenPrice(function(price){
    res.send(price);
  })
});


router.put('/votes/candidate/:name', function(req, res, next){
  voting.voteForCandidate(req.params.name, req.body, function(result){
    res.send(result);
  })
})

module.exports = router;
