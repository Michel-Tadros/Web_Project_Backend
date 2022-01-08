const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dieticians=require('../models/dietician');
var authenticate = require('../authenticate');

const dieticianRouter = express.Router();

dieticianRouter.use(bodyParser.json());

dieticianRouter.route('/')
.get((req,res,next) => {
    dieticians.find({})
    .populate('User_id','_id')
    .then((dieticians)=>{
        res.statusCode=200;
        res.setHeader("Content-type","application/json");
        res.json(dieticians);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    dieticians.create(req.body)
    .then((dietician)=>{
        dietician.User_id=req.user._id;
        dietician.save();
        console.log("dietician created",dietician);
        res.setHeader("Content-type","application/json");
        res.json(dietician);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dieticianes');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    dieticians.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader("Content-type","application/json");
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

dieticianRouter.route('/:dieticianId')
.get((req,res,next) => {
    dieticians.findById(req.params.dieticianId)
    .populate('User_id','_id')
    .then((dietician) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dietician);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyDietecian,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dieticians/'+ req.params.dieticianId);
})
.put(authenticate.verifyUser,authenticate.verifyDietecian, (req, res, next) => {
    dieticians.findByIdAndUpdate(req.params.dieticianId, {
        $set: req.body
    }, { new: true })
    .then((dietician) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dietician);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    dieticians.findByIdAndRemove(req.params.dieticianId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = dieticianRouter;