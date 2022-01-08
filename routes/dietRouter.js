const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const diets=require('../models/diet');


const dietRouter = express.Router();

dietRouter.use(bodyParser.json());
var authenticate = require('../authenticate');

dietRouter.route('/')
.get((req,res,next) => {
    diets.find({})
    .populate('dietician','_id')
    .then((diets)=>{
        res.statusCode=200;
        res.setHeader("Content-type","application/json");
        res.json(diets);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,authenticate.verifyDietecian, (req, res, next) => {
    diets.create(req.body)
    .then((diet)=>{
        diet.dietician=req.user._id;
        diet.save();
        console.log("diet created",diet);
        res.setHeader("Content-type","application/json");
        res.json(diet);
    },(err)=>next(err)).catch((err)=>next(err));
    
})
.put(authenticate.verifyUser,authenticate.verifyDietecian, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /diets');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    diets.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader("Content-type","application/json");
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

dietRouter.route('/:dietId')
.get((req,res,next) => {
    diets.findById(req.params.dietId)
    .populate('dietician','_id')
    
    .then((diet) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(diet);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,authenticate.verifyDietecian,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dietsId/'+ req.params.dietId);
})
.put(authenticate.verifyUser,authenticate.verifyDietecian, (req, res, next) => {
    diets.findByIdAndUpdate(req.params.dietId, {
        $set: req.body
    }, { new: true })
    .then((diet) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(diet);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    diets.findByIdAndRemove(req.params.dietId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

dietRouter.route('/:dietId/dietician')
.get((req,res,next) => {
    diets.findById(req.params.dietId)
    .populate('dietician','_id')
    .then((diet) => {
        if (diet != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(diet.dietician);
        }
        else {
            err = new Error('diet ' + req.params.dietId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,authenticate.verifyDietecian, (req, res, next) => {
    diets.findById(req.params.dietId)
    .then((diet) => {
        if (diet != null) {
            req.body.dietician = req.user._id;
            diet.dietician.push(req.body);
            diet.save()
            .then((diet) => {
                diets.findById(diet._id)
                .populate('dietician','_id')
                .then((diet) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(diet);
                })            
            }, (err) => next(err));
        }
        else {
            err = new Error('diet ' + req.params.dietId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})


module.exports = dietRouter;