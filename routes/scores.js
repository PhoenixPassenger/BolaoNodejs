var express = require('express');
var router = express.Router();
const models = require('../models/index')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
process.env.SECRET_KEY = 'secret'
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/calculate', function (req,res,next) {
    var decoded = jwt.verify(req.headers['x-access-token'], process.env.SECRET_KEY)
    models.User.findOne({where: {
        id: decoded.id
    }})
    .then(user => {
        models.Hint.findAll({where: {
            UserId: user.id,
            competitionName : req.body.competitionName
        }})
        .then(vethints => {
            models.Round.findAll({where: {
                competitionName : req.body.competitionName
            }})
            .then(vetrounds => {
                var score = 0
                var scorearr = []
                for (hint of vethints) {
                    for (round of vetrounds) {
                        if (hint.TeamId == round.TeamId && hint.rank == round.rank){
                            score++
                            scorearr.push(hint)
                        } 
                    }
                }
                res.send({
                    score: score,
                    teamsScored: scorearr
                })

            })
        })
        .catch(error => {
            res.send("Error: ", error)
        })
    })
    .catch(err => {
        res.send("Err: ", err)
    })
    
})

module.exports = router;