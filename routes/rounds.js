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

router.post('/register', (req, res) => {
    console.log("entrou aqui")
    const roundData = {
        competitionName: req.body.competitionName,
        idTeam: req.body.idTeam,
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

module.exports = router;


