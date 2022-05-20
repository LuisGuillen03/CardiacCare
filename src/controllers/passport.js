import passport from "passport";
import LocalStrategy from 'passport-local'
import { getConnection } from "../database/connection";
import helpers from "./helpers"
import sql from 'mssql'
import {config} from 'dotenv'
var Recaptcha = require('express-recaptcha').RecaptchaV2
var recaptcha = new Recaptcha(process.env.SITEKEY, process.env.SECRETKEY)
config();

  passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true}, 
    async (req, username, password, done) => {
      recaptcha.verify (req,async function(error,data){
        if(!error){
            const pool = await getConnection();
            const rows = await pool.request()
            .input("username",sql.VarChar,username)
            .query("SELECT * FROM ObjUsuarios WHERE username = @username")
            if(rows.rowsAffected>0){
              const user=rows.recordset[0]
              const validPassword= await helpers.matchPassword(password, user.Password)
              if(validPassword){
                done(null, user, null);
              }  else {
                done(null, false, req.flash('fail', 'Incorrect Password'));
              }
            } else{
              return done(null, false, req.flash('fail', 'The Username does not exists.'));
            }
        }
        else{
            console.log('no llego')
        }
    })}));

passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: false
}, async (req, username, password, done) => {
        const info=req.body;
        info.password= await helpers.encryptPassword(info.password);
        const pool = await getConnection();
        await pool.request()
        .input("username",sql.VarChar,info.username)
        .input("fullname",sql.VarChar,info.fullname)
        .input("password",sql.VarChar,info.password)
        .input("rol",sql.TinyInt,info.rol)
        .query('INSERT INTO ObjUsuarios(Username,Fullname,Password,Id_Rol) VALUES (@username,@fullname,@password,@rol)')
        const consult=await pool.request()
        .query('SELECT TOP 1 Id FROM ObjUsuarios ORDER BY ID DESC')
        info.Id = consult.recordset[0].Id
        return done(null, info);
    }
));

passport.serializeUser((user, done) => {
    done(null, user.Id);
  });

passport.deserializeUser(async (id, done) => {
    const pool = await getConnection()
    const rows = await pool.request()
    .input("id",sql.SmallInt,id)
    .query('SELECT * FROM ObjUsuarios WHERE Id = @id');
    done(null, rows.recordset[0]);
  });
