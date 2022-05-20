import {config} from 'dotenv'
config();
const express=require('express');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn }= require('../controllers/auth');
import sql from 'mssql'
import helpers from "../controllers/helpers"
const router=express.Router();
import { getConnection } from "../database/connection";

router.get('/antecedentes', isLoggedIn, async (req, res) =>{
    const powers=helpers.rolcap(req.user.Id_Rol)
    res.render('Salud/formjugador', {powers});
});

router.post('/antecedentes', isLoggedIn, async (req, res) =>{
    const info = req.body;
    const pool = await getConnection();
    const rows = await pool.request()
    .input("fullname",sql.VarChar,info.fullname)
    .query('EXEC AntecedentesPorJugador @fullname')
    const data=rows.recordset; 
    const name=info.fullname
    const powers=helpers.rolcap(req.user.Id_Rol)
    res.render('Salud/antecedentes', {powers,data,name});
});

router.get('/users', isLoggedIn, async (req, res) =>{
    const pool = await getConnection();
    const rows = await pool.request()
    .query('SELECT * FROM ViewUsuarios')
    const data=rows.recordset; 
    const powers=helpers.rolcap(req.user.Id_Rol)
    res.render('Users/users', {powers,data});
});

router.get('/registro_tpj', isLoggedIn, async (req, res) =>{
    const info = req.user;
    const name=info.Fullname
    const pool = await getConnection();
    const rows = await pool.request()
    .input("fullname",sql.VarChar,info.Fullname)
    .query('EXEC ShowTallaPeso @fullname')
    const data=rows.recordset; 
    const powers=helpers.rolcap(req.user.Id_Rol)
    res.render('Salud/registrotpm', {powers,data,name});
});

router.get('/registro_ap', isLoggedIn, async (req, res) =>{
    const powers=helpers.rolcap(req.user.Id_Rol)
    res.render('Salud/formjugador2', {powers});
});

router.post('/registro_ap', isLoggedIn, async (req, res) =>{
    const info=req.body
    const pool = await getConnection();
    const rows = await pool.request()
    .input("fullname",sql.VarChar,info.fullname)
    .query('EXEC ShowTallaPeso @fullname')
    const data=rows.recordset; 
    const name=info.fullname
    const powers=helpers.rolcap(req.user.Id_Rol)
    res.render('Salud/registrotpm', {powers,data,name});
});

router.get('/mediciones_partido', isLoggedIn, async (req, res) =>{
    const powers=helpers.rolcap(req.user.Id_Rol)
    res.render('Rendimiento/formjugfe', {powers});
});

router.post('/mediciones_partido', isLoggedIn, async (req, res) =>{
    const info = req.user;
    const name=info.Fullname
    const fecha = req.body.fecha;
    const pool = await getConnection()
    const rows = await pool.request()
    .input("fullname",sql.VarChar,name)
    .input("date",sql.Date,fecha)
    .query('EXEC ProMedJugXPart @fullname, @date')
    var data=rows.recordset[0]; 
    var Descrip=""
    var PPM=""
    var Oxi=""
    var PD=""
    var PS=""
    if(rows.rowsAffected>0){
        Descrip=data.Descripcion
        PPM=data.Promedio_PPM
        Oxi=data.Promedio_Oxigenacion
        PD=data.Promedio_Presion_Diastolica
        PS=data.Promedio_Presion_Sistolica
    }

    const powers=helpers.rolcap(req.user.Id_Rol)
    res.render('Rendimiento/medpart', {powers,name,Descrip,PPM,Oxi,PD,PS});
});

router.get('/km_partido', isLoggedIn, async (req, res) =>{
    const powers=helpers.rolcap(req.user.Id_Rol)
    res.render('Rendimiento/formjugfe2', {powers});
});

router.post('/km_partido', isLoggedIn, async (req, res) =>{
    const info = req.user;
    const name=info.Fullname
    const fecha = req.body.fecha;
    const pool = await getConnection()
    const rows = await pool.request()
    .input("fullname",sql.VarChar,name)
    .input("date",sql.Date,fecha)
    .query('EXEC KmXPart @fullname, @date')
    const data=rows.recordset[0]; 
    var Descrip=""
    var Dist=""
    if(rows.rowsAffected>0){
        const Descrip=data.Descripcion
        const Dist=data.Distancia_Recorrida
    }
    const powers=helpers.rolcap(req.user.Id_Rol)
    res.render('Rendimiento/kmpartido', {powers,name,Descrip,Dist});
});

router.get('/alertas_partido', isLoggedIn, async (req, res) =>{
    const powers=helpers.rolcap(req.user.Id_Rol)
    res.render('Salud/formdate', {powers});
});

router.post('/alertas_partido', isLoggedIn, async (req, res) =>{
    const fecha = req.body.fecha;
    const pool = await getConnection()
    const rows = await pool.request()
    .input("date",sql.Date,fecha)
    .query('EXEC AlertasPorPartido @date')
    const data=rows.recordset; 
    var descrip="";
    if(rows.rowsAffected>0){
        descrip=rows.recordset[0].Descripcion
    }
    const powers=helpers.rolcap(req.user.Id_Rol)
    res.render('Salud/alertpart', {powers, data, descrip});
});

router.get('/mediciones_generales', isLoggedIn, async (req, res) =>{
    const powers=helpers.rolcap(req.user.Id_Rol)
    res.render('Salud/formdatejug', {powers});
});

router.post('/mediciones_generales', isLoggedIn, async (req, res) =>{
    const fecha = req.body.fecha;
    const name = req.body.fullname;
    const pool = await getConnection()
    const rows = await pool.request()
    .input("fullname",sql.VarChar,name)
    .input("date",sql.Date,fecha)
    .query('EXEC MedicionesGenerales @fullname , @date')
    const data=rows.recordset; 
    var descrip=""
    var ubi=""
    if(rows.rowsAffected>0){
        descrip=rows.recordset[0].DescripcionDelPartido
        ubi=rows.recordset[0].UbicacionDelPartido
    }
    const powers=helpers.rolcap(req.user.Id_Rol)
    res.render('Salud/medgeneral', {powers,data,descrip,ubi,name});
});

export default router