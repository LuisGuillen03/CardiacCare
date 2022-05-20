import express from "express"
import config from './config'
import dataRoutes from './routes/data.routes'
import authentication from './routes/authentication'
import {engine} from "express-handlebars"
import path from "path"
import {dbSettings,getConnection} from "./database/connection"
const session = require('express-session');
var MssqlStore = require('mssql-session-store')(session);
const flash = require ('connect-flash');
import passport from "passport"
import sql from "mssql"

//inicializaciones
const app=express()
require('./controllers/passport')


// settings
app.set('port', config.port)
app.set('views', path.join(__dirname, '/views'));
app.engine('.hbs', engine({
  extname: "hbs",
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
}))
app.set('view engine', '.hbs');

//middlewares
  app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  }));
app.use(flash());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize());
app.use(passport.session());

//Global Variables
app.use((req,res,next) =>{
  app.locals.success = req.flash('success');
  app.locals.fail= req.flash('fail');
  app.locals.user= req.user;
  next();
});


//Routes
app.use(dataRoutes)
app.use(authentication)

//Public

app.use(express.static(path.join(__dirname,'public')));

export default app

