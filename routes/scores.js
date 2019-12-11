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
                var success = 0
                var scorearr = []
                for (hint of vethints) {
                    var round = vetrounds.find(obj =>{
                        return obj.TeamId === hint.TeamId
                    })
                    if(hint.rank == round.rank){
                        success++
                        scorearr.push(hint)
                    }
                    score += Math.pow(hint.rank - round.rank,2)


                }
                score = Math.sqrt(score)
                let obj = {
                    UserId: parseInt(user.id),
                    competitionName: req.body.competitionName,
                    score : score,
                    hits : success
                }
                console.log(obj)
                models.Ranking.create(obj).then(
                    res.send({
                        score: score,
                        hits : success,
                        hintsScore: scorearr
                    })
                )
                

            })
            .catch(errou=>{
                console.log("EROOU" + errou)
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

router.post('/rankings', (req,res,next) => {
    models.Ranking.findAll({include : [
        {model : models.User, as: 'user'}
    ],
        where : {
        competitionName : req.body.competitionName}
    }).then(resp => {
        res.send(resp)
    })
})

module.exports = router;
