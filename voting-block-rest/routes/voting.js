const express = require('express'),
router = express.Router(),
VotingModel = require('../models/voting'),
voting = new VotingModel();


/* GET users listing. */
router.get('/count/:name', function(req, res, next) {
  voting.getVotes(req.params.name, function(votes){
    res.send(votes);
  });
});

module.exports = router;
