const express = require('express');
const passport = require('passport');
const { Strategy } = require('passport-github')
const { ensureLoggedIn } = require('connect-ensure-login')
const github = require ('octonode')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const path = require ('path')

const config = require('./config.json')

// const githubAuth = require('./authentication/github')

let dropbox = false
const localAuth = dropbox ? require('./authentication/local') : require('./authentication/local_db')

const app = express();

// NOTE: Configurar todas las est rategias
// passport.use(githubAuth.strategy(config))
passport.use(localAuth.strategy(config))

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

app.set('views', path.resolve(__dirname + '/views'));
app.set('view engine', 'ejs');

app.use(logger('tiny'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/')
  res.render('login', {config})
})

app.get('/error', (req, res) => {
  res.render('error')
})
// NOTE: Configurar todos los logins
// app.use(githubAuth.login())
app.use(localAuth.login())

app.get('/assets/*', express.static('assets'))

// NOTE: configurar todos los middlewares

app.use((req, res, next) => req.isAuthenticated() ? next() : res.redirect('/login'))
// app.use(githubAuth.middleware(config))
app.use(localAuth.middleware(config))

app.get('*', express.static('gh-pages'))

app.use((req, res) => res.render('error', {error: true}))

const port = process.env.PORT || 8080
console.log(`Express escuchando en puerto ${port}`)
app.listen(port)
