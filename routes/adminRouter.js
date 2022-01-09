const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Admins=require('../models/Admin');
const cors=require('./cors');
var authenticate = require('../authenticate');

const adminRouter = express.Router();

adminRouter.use(bodyParser.json());


/* GET users listing. */
adminRouter.route('/')
.options(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res)=>{res.sendStatus(200);})
.get(cors.cors,(req,res,next) => {
    Admins.find({})
    .populate('User_id','_id')
    .then((admins)=>{
        res.statusCode=200;
        res.setHeader("Content-type","application/json");
        res.json(admins);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    
    Admins.create(req.body)
    .then((admin)=>{
        admin.User_id=req.user._id;
        req.user.admin=true;
        admin.save();
        console.log("Admin created",admin);
        res.setHeader("Content-type","application/json");
        res.json(admin);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /admins');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Admins.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader("Content-type","application/json");
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

adminRouter.route('/:adminId')
.options(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res)=>{res.sendStatus(200);})

.get(cors.cors,(req,res,next) => {
    Admins.findById(req.params.adminId)
    .populate('User_id','_id')
    .then((admin) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(admin);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /admins/'+ req.params.adminId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Admins.findByIdAndUpdate(req.params.adminId, {
        $set: req.body
    }, { new: true })
    .then((admin) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(admin);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
    Admins.findByIdAndRemove(req.params.adminId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});




module.exports = adminRouter;
