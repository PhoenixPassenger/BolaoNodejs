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

//list all teams
router.get('/all', (req, res) => {
  models.Team.findAll({
  }).then(Team => {
    if(Team){
        res.send(Team)
    }
})
});

//create new team
router.post('/new',(req,res) =>{
    const today = new Date()
    const teamData = {
      name: req.body.name,
      coach: req.body.coach,
      capitan: req.body.capitan,
    }
    models.Team.create(teamData).then(team => {
                res.json({ status: team.name + ' Registered!'})
              })
              .catch(err => {
                res.send('error: ' + err)
              })
  });


  //find team by id
  router.post('/find/',(req,res)=>{
    console.log(req.body.id)
    models.Team.findOne({
    where : {id : req.body.id}}
    ).then(user => {
        res.json({ status: user})
      })
      .catch(err => {
        res.send('error: ' + err)
      })
})


//delete team by id
router.delete('/del/',(req,res)=> {
    console.log(req.body.id)
    models.Team.destroy({
        where: {
            id: req.body.id
        }
    })
    .then(resp => 
      {res.json(resp)})

})


//update team data by id
router.put('/update/',(req,res) =>
{
  models.Team.findOne({
    where: {
      id: req.body.id
    }
    })
    .then(team =>{
    const teamData = {
        name: req.body.name ? req.body.name : team.name,
      coach: req.body.coach ? req.body.coach : team.coach,
      capitan: req.body.capitan ? req.body.capitan : team.capitan
    }
    console.log('até aqui foi')
    models.Team.update(
      {name: teamData.name,
        coach: teamData.coach,
        capitan: teamData.capitan
      },
      {where: {id : team.id}}
    ).then(newTeam => {res.send(newTeam)})
    .catch(res.send(team))


    })
    .catch(res => {
      return res
    })
  });

module.exports = router;
