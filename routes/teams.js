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
    var decoded = jwt.verify(req.headers['x-access-token'], process.env.SECRET_KEY)
  models.User.findOne({
    where: {
      id: decoded.id
    }
    }).then(user =>{
        if(user.isAdmin){
            models.Team.create(teamData).then(team => {
                res.json({ status: team.name + ' Registered!'})
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
    var decoded = jwt.verify(req.headers['x-access-token'], process.env.SECRET_KEY)
  models.User.findOne({
    where: {
      id: decoded.id
    }
    }).then(user => {
        if (user.isAdmin){

            console.log(req.body.id)
            models.Team.destroy({
                where: {
                    id: req.body.id
                }
            })
            .then(resp => 
              {res.json(resp)})
    
        }
        }).catch(err => {
            res.send(err)
        })

})


//update team data by id
router.put('/update/',(req,res) =>
{
    var decoded = jwt.verify(req.headers['x-access-token'], process.env.SECRET_KEY)
    models.User.findOne({
      where: {
        id: decoded.id
      }
      }).then(user => {
        if(user.isAdmin){
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
        }
      })
      .catch(err => {
        res.send(err)
    })
  });

  router.get('/generate', function(req, res, next) {
    models.Team.bulkCreate([
    {
        name: "Flamengo",
        img: "https://ssl.gstatic.com/onebox/media/sports/logos/orE554NToSkH6nuwofe7Yg_48x48.png",
        coach: "Arnaldo",
        capitan: "Arnaldo"
    },{
        name: "Santos",
        img: "https://ssl.gstatic.com/onebox/media/sports/logos/VHdNOT6wWOw_vJ38GMjMzg_48x48.png",
        coach: "Arnaldo",
        capitan: "Arnaldo"
    },{
        name: "Palmeiras",
        img: "https://ssl.gstatic.com/onebox/media/sports/logos/7spurne-xDt2p6C0imYYNA_48x48.png",
        coach: "Arnaldo",
        capitan: "Arnaldo"
    },{
        name: "Grêmio",
        img: "https://ssl.gstatic.com/onebox/media/sports/logos/Ku-73v_TW9kpex-IEGb0ZA_48x48.png",
        coach: "Arnaldo",
        capitan: "Arnaldo"
    },{
        name: "Athlético-PR",
        img: "https://ssl.gstatic.com/onebox/media/sports/logos/wDMLzBXmGU4qz1lXUnBQvQ_48x48.png",
        coach: "Arnaldo",
        capitan: "Arnaldo"
    },{
        name: "São Paulo",
        img: "https://ssl.gstatic.com/onebox/media/sports/logos/4w2Z97Hf9CSOqICK3a8AxQ_48x48.png",
        coach: "Arnaldo",
        capitan: "Arnaldo"
    },{
        name: "Internacional",
        img: "https://ssl.gstatic.com/onebox/media/sports/logos/OWVFKuHrQuf4q2Wk0hEmSA_48x48.png",
        coach: "Arnaldo",
        capitan: "Arnaldo"
    },{
        name: "Corinthians",
        img: "https://ssl.gstatic.com/onebox/media/sports/logos/tCMSqgXVHROpdCpQhzTo1g_48x48.png",
        coach: "Arnaldo",
        capitan: "Arnaldo"
    },{
        name: "Goiás",
        img: "https://ssl.gstatic.com/onebox/media/sports/logos/T2Lg4VLRDin0YC9h5He3Eg_48x48.png",
        coach: "Arnaldo",
        capitan: "Arnaldo"
    },{
        name: "Bahia",
        img: "https://ssl.gstatic.com/onebox/media/sports/logos/nIdbR6qIUDyZUBO9vojSPw_48x48.png",
        coach: "Arnaldo",
        capitan: "Arnaldo"
    },{
        name: "Vasco da Gama",
        img: "https://ssl.gstatic.com/onebox/media/sports/logos/gsztcvqa9uLPU546_tDm0g_48x48.png",
        coach: "Arnaldo",
        capitan: "Arnaldo"
    },{
        name: "Fortaleza",
        img: "https://ssl.gstatic.com/onebox/media/sports/logos/nwmOj81FjK-pmss5tX650Q_48x48.png",
        coach: "Arnaldo",
        capitan: "Arnaldo"
    },{
        name: "Atlético",
        img: "https://ssl.gstatic.com/onebox/media/sports/logos/q9fhEsgpuyRq58OgmSndcQ_48x48.png",
        coach: "Arnaldo",
        capitan: "Arnaldo"
    },{
        name: "Botafogo",
        img: "https://ssl.gstatic.com/onebox/media/sports/logos/KLDWYp-H8CAOT9H_JgizRg_48x48.png",
        coach: "Arnaldo",
        capitan: "Arnaldo"
    },{
        name: "Ceará-SC",
        img: "https://ssl.gstatic.com/onebox/media/sports/logos/mSl0cz3i2t8uv4zcprobOg_48x48.png",
        coach: "Arnaldo",
        capitan: "Arnaldo"
    },{
        name: "Cruzeiro",
        img: "https://ssl.gstatic.com/onebox/media/sports/logos/cfkLbPGt7TD_FSDotajcbA_48x48.png",
        coach: "Arnaldo",
        capitan: "Arnaldo"
    },{
        name: "Fluminense",
        img: "https://ssl.gstatic.com/onebox/media/sports/logos/fCMxMMDF2AZPU7LzYKSlig_48x48.png",
        coach: "Arnaldo",
        capitan: "Arnaldo"
    },{
        name: "CSA",
        img: "https://ssl.gstatic.com/onebox/media/sports/logos/1TftGbZs_8FcYQUdRZC2Sw_48x48.png",
        coach: "Arnaldo",
        capitan: "Arnaldo"
    },{
        name: "Chapecoense",
        img: "https://ssl.gstatic.com/onebox/media/sports/logos/cZ4ga5Fdqe3Pd-dEcpjUmg_48x48.png",
        coach: "Arnaldo",
        capitan: "Arnaldo"
    },{
        name: "Avaí",
        img: "https://ssl.gstatic.com/onebox/media/sports/logos/9cwCmoBXGaPJ_Q5cgUeocg_48x48.png",
        coach: "Arnaldo",
        capitan: "Arnaldo"
    }
])
    .then((newTeam) => {
        console.log('gerado')
    })
    .catch((err) => {
        console.log("deu erro: ", err) 
    })
});

module.exports = router;

