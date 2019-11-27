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

//list all users
router.get('/all', (req, res) => {
  models.User.findAll({
  }).then(User => {
    if(User)
    res.send(User)
})
});

//register new user
router.post('/register', (req, res) => {
  const today = new Date()
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    isAdmin : req.body.isAdmin,
    nickname : req.body.nickname
  }
  console.log(userData)

  models.User.findOne({
    where: {
      email: req.body.email
    }
  })
    
    .then(user => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash
          models.User.create(userData)
            .then(user => {
              res.json({ status: user.email + ' Registered!' })
            })
            .catch(err => {
              res.send('error: ' + err)
            })
        })
      } else {
        res.json({ error: 'User already exists' })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

//login sending jwt token
router.post('/login', (req, res) => {
  models.User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
            expiresIn: 10000000
          })
          res.send(token)
        }
      } else {
        res.status(400).json({ error: 'User does not exist' })
      }
    })
    .catch(err => {
      res.status(400).json({ error: err })
    })
})

//delete user by id
router.delete('/del/:id',(req,res)=>
{
  var decoded = jwt.verify(req.headers['x-access-token'], process.env.SECRET_KEY)
  models.User.findOne({
    where: {
      id: decoded.id
    }
    }).then(userDelete=>{
      console.log(userDelete.id == req.params.id )
      if (userDelete.isAdmin || userDelete.id == req.params.id ){
        models.User.destroy({
          where: {
              id: req.params.id
          }
      }).then(resp => 
        {res.json(resp)})
      }else{
        res.send('Tu não és admin meu parceiro')
      }
    })
})


//show the profile
router.get('/profile', (req, res) => {
  var decoded = jwt.verify(req.headers['x-access-token'], process.env.SECRET_KEY)
  models.User.findOne({
    where: {
      id: decoded.id
    }
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

//Update data from user
router.put('/update/',(req,res) =>
{
  var decoded = jwt.verify(req.headers['x-access-token'], process.env.SECRET_KEY)
  models.User.findOne({
    where: {
      id: decoded.id
    }
    })
    .then(user =>{
    const userData = {
      name: req.body.name ? req.body.name : decoded.name,
      nickname: req.body.nickname ? req.body.nickname : decoded.nickname,
      email: req.body.email ? req.body.email : decoded.email
    }
    console.log(userData)
    models.User.update(
      {name: userData.name,
        nickname: userData.nickname,
        email: userData.email
      },
      {where: {id : decoded.id}}
    ).then(teste => {res.send(teste)})
    


  // models.User.update(
  //     userData, {where: { id: '1' } })

    })
    .catch(res => {
      res.send(res)
    })
  });


//change password
router.put('/changePassword/',(req,res) =>
{
  var decoded = jwt.verify(req.headers['x-access-token'], process.env.SECRET_KEY)
  models.User.findOne({
    where: {
      id: decoded.id
    }
    })
    .then(async user =>{
      console.log(user.name)
    let userData = {
      password: req.body.password ? req.body.password : decoded.password,
    }
  //   console.log('chegou aqui')
    
  //     console.log('chegou aqui 2')
  //   bcrypt.hash(userData.password, 10, (err, hash) => {
  //   let newPassord = hash
  //   }).then(ress =>{
  //     console.log(ress)
  //   })
  //  console.log('chegou aqui 3')
    
    
   bcrypt.hash(userData.password, 10, (err, hash) => {
    userData.password = hash
    models.User.update(
      {password: userData.password
      },
      {where: {id : user.id}}
    ).then(res.send(user))
  })

    

    
    })
    .catch(res => {
      return res
    })
  });


module.exports = router;
