const express=require('express');
const router=express.Router();
const passport = require('passport');
import helpers from "../controllers/helpers"
import { getConnection } from "../database/connection";
const { isLoggedIn, isNotLoggedIn }= require('../controllers/auth');
import {storeUser} from "../controllers/data.controller"

// SIGNUP
router.get('/register', isLoggedIn,(req, res) => {
    const powers=helpers.rolcap(req.user.Id_Rol)
    res.render('auth/signup', {powers});
  });

router.post('/register',isLoggedIn, storeUser);

// SIGNIN
router.get('/login', isNotLoggedIn,(req, res) => {
    res.render('auth/signin');
  });

router.post('/login', isNotLoggedIn ,(req, res, next) =>{
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/profile', isLoggedIn,(req, res) =>{
    const powers=helpers.rolcap(req.user.Id_Rol)
    res.render('profile', {powers});
});

router.get('/logout', isLoggedIn, (req,res)=>{
    req.logOut();
    res.redirect('/login');
});
module.exports = router;