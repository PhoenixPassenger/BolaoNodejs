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

router.get('/all', (req, res) => {
  models.Hint.findAll({
  }).then(hint => {
    if(hint){
        res.send(hint)
    }
})
});


router.post('/register', (req, res) => {
  console.log("entrou aqui")
  
    var decoded = jwt.verify(req.headers['x-access-token'], process.env.SECRET_KEY)
    const hintData = {
      UserId: decoded.id,
      competitionName: req.body.competitionName,
      TeamId: req.body.TeamId,
      rank: req.body.rank
    }
models.User.findOne({
  where: {
    id: decoded.id
  }
  }).then(user =>{
      models.Hint.create(hintData)
      .then(ans =>{
        res.send("enviado")
      })
  })
  .catch(err =>{
      res.send('error: ' + err)
  })

});


//delete hint
router.delete('/del/',(req,res)=> {
  var decoded = jwt.verify(req.headers['x-access-token'], process.env.SECRET_KEY)
  models.User.findOne({
    where: {
      id: decoded.id
    }
    }).then(user =>{
        if(user.isAdmin){
          models.Hint.destroy({
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
      models.Hint.findOne({where : {id: req.params.id}})
      .then(hint =>{
          const hintData = {
            UserId: req.body.UserId ? req.body.UserId : hint.UserId,
              competitionName: req.body.competitionName ? req.body.competitionName : hint.competitionName,
              TeamId: req.body.TeamId ? req.body.TeamId : hint.TeamId,
              rank: req.body.rank ? req.body.rank : hint.rank
          }
          models.Hint.update({
              UserId: hintData.UserId,
              competitionName: hintData.competitionName,
              idTeam: hintData.TeamId,
              rank: hintData.rank
          },{where : {id: hint.id}})

          .then(res.send(hint))
      })
  }     
  
  })



})

module.exports = router;