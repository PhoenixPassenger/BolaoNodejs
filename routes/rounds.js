var express = require('express');
var router = express.Router();
const models = require('../models/index')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
process.env.SECRET_KEY = 'secret'

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//list all rounds
router.get('/all', (req, res) => {
    models.Round.findAll({
    }).then(round => {
      if(round){
          res.send(round)
      }
  })
  });

router.post('/register', (req, res) => {
    console.log("entrou aqui")
    const roundData = {
        competitionName: req.body.competitionName,
        TeamId: req.body.TeamId,
        rank: req.body.rank
      }
      var decoded = jwt.verify(req.headers['x-access-token'], process.env.SECRET_KEY)
  models.User.findOne({
    where: {
      id: decoded.id
    }
    }).then(user =>{
        if(user.isAdmin){
            models.Round.create(roundData).then(round => {
                res.json({ status: round.competitionName + ' Registered!'})
              })
              .catch(err => {
                res.send('error: ' + err)
              })
        }else{
            res.send('tu não és admin parceiro')
        }
    })
    .catch(err =>{
        res.send('error: ' + err)
    })

});


//delete round
router.delete('/del/',(req,res)=> {
    var decoded = jwt.verify(req.headers['x-access-token'], process.env.SECRET_KEY)
    models.User.findOne({
      where: {
        id: decoded.id
      }
      }).then(user =>{
          if(user.isAdmin){
            models.Round.destroy({
                where: {
                    id: req.body.id
                }
            })
            .then(resp => 
              {res.json(resp)})
          }else{
              res.send('tu não és admin parceiro')
          }
      })
      .catch(err =>{
          res.send('error: ' + err)
      })
  
})

router.put('/update/:id',(req,res) =>{
var decoded = jwt.verify(req.headers['x-access-token'], process.env.SECRET_KEY)

models.User.findOne({where :
{id: decoded.id}})
.then(user=> {
    if(user.isAdmin){
        models.Round.findOne({where : {id: req.params.id}})
        .then(round =>{
            const roundData = {
                competitionName: req.body.competitionName ? req.body.competitionName : round.competitionName,
                TeamId: req.body.TeamId ? req.body.TeamId : round.TeamId,
                rank: req.body.rank ? req.body.rank : round.rank
            }
            models.Round.update({
                competitionName: roundData.competitionName,
                idTeam: roundData.TeamId,
                rank: roundData.rank
            },{where : {id: round.id}})

            .then(res.send(round))
        })
    }
    
    })



})

module.exports = router;


