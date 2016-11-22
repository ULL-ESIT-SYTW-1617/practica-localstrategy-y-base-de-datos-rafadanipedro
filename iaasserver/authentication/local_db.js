const passport = require('passport');
const { Strategy } = require('passport-local')
const bcrypt = require('bcrypt-nodejs')
const Sequelize = require('sequelize')
const UserSchema = require('../models/user_db')

const strategy = (config) => {
  const db = new Sequelize('database', 'rafa', 'password', {
    dialect: 'sqlite',
    storage: './db.sqlite'
  });

  const User = UserSchema(db)

  db.sync().then(() => {
    console.log('Conectado con sqlite!!')

    User.findOne().then(user => {
      if(!user) {
        return Promise.all(config.BaseDatos.lectores.map(lector =>
          User.create({email: lector, password: bcrypt.hashSync('1234')})
        ))
      }
    })
    .then(() => console.log('Metidos todos los usuarios'))
    .catch(err => {
      console.log('Hubo un error')
      console.error(err)
    })
  })

  return new Strategy({
    usernameField: 'email',
    passwordField: 'password'
  }, (email, password, done) => {
    console.log(`Parece que el usuario ${email} quiere auntenticarse xD`)
    User.findOne({where: {email}}).then(user => {
      console.log('Vamos aa ver si lo encontre:')
      console.log(user)
      if (!user) return done(null, false)
      if (bcrypt.compareSync(password, user.password)) {
        user.auth = 'Local'
        return done(null, user)
      }
      return done(null, false)
    }).catch(console.error)
  })
}

const login = () => {
  const router = require('express').Router()
/*
  router.get('/login/password', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/login')
    res.render('reg', req.user.content)
  })

  router.post('/login/password', (req, res) => {
    if (bcrypt.compareSync(req.body.OldPassword, req.user.content.password)) {
      if (req.body.NewPass === req.body.ConfirmPass) {
        console.log('Ok, las contraseñas coinciden')
        return User.findOneUpdate({email: req.user.content.email}, {password: bcrypt.hashSync(req.body.NewPass)}).then(() => {
          res.send('OOOOkkkkkk')
        }).catch(err => {
          console.log(err)
          res.send(':(')
        })
      }
    }
    res.redirect('/login/password')
  })
*/
  router.post('/login/local', passport.authenticate('local', {failureRedirect : '/login'}), (req, res) => res.redirect('/'));

  return router
}

const middleware = () => (req, res, next) => {
  /*
  if(bcrypt.compareSync('1234', req.user.content.password)) {
      return res.redirect('/login/password')
    }*/
  next()
}

module.exports = {
  strategy,
  login,
  middleware
}





