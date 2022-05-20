import { getConnection } from "../database/connection";
import sql from 'mssql'
import helpers from "./helpers"
import {config} from 'dotenv'
import app from "../app";
var Recaptcha = require('express-recaptcha').RecaptchaV2
config();

var recaptcha = new Recaptcha(process.env.SITEKEY, process.env.SECRETKEY)

export const Home = (req,res) =>{
    res.render('index');
}
export const storeUser = async (req,res) =>{
    const info = req.body;
    info.password= await helpers.encryptPassword(info.password);
    const pool = await getConnection();
    await pool.request()
    .input("username",sql.VarChar,info.username)
    .input("fullname",sql.VarChar,info.fullname)
    .input("password",sql.VarChar,info.password)
    .input("rol",sql.TinyInt,info.rol)
    .query('INSERT INTO ObjUsuarios(Username,Fullname,Password,Id_Rol) VALUES (@username,@fullname,@password,@rol)')
    return res.redirect('/profile');
} ;
