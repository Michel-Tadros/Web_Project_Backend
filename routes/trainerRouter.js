const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Trainers=require('../models/Trainers');



var authenticate = require('../authenticate');

const trainerRouter = express.Router();

trainerRouter.use(bodyParser.json());

trainerRouter.route('/')
.get((req,res,next) => {
    Trainers.find({})
    .populate('User_id','_id')
    .then((trainers)=>{
        res.statusCode=200;
        res.setHeader("Content-type","application/json");
        res.json(trainers);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    
    Trainers.create(req.body)
    .then((trainer)=>{
        trainer.User_id=req.user._id;
        trainer.save();
        console.log("Trainer created",trainer);
        res.setHeader("Content-type","application/json");
        res.json(trainer);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /traineres');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    Trainers.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader("Content-type","application/json");
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

trainerRouter.route('/:trainerId')
.get((req,res,next) => {
    Trainers.findById(req.params.trainerId)
    .populate('User_id','_id')
    .then((trainer) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(trainer);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /trainers/'+ req.params.trainerId);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Trainers.findByIdAndUpdate(req.params.trainerId, {
        $set: req.body
    }, { new: true })
    .then((trainer) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(trainer);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Trainers.findByIdAndRemove(req.params.trainerId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

trainerRouter.route('/:trainerId/workout')
.get((req,res,next) => {
    Trainers.findById(req.params.trainerId)
    .populate('User_id','_id')
    .then((trainer) => {
        if (trainer != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(trainer.workout);
        }
        else {
            err = new Error('trainer ' + req.params.trainerId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Trainers.findById(req.params.trainerId)
    .then((trainer) => {
        if (trainer != null) {
            req.body.author = req.user._id;
            trainer.workout.push(req.body);
            trainer.save()
            .then((trainer) => {
                Trainers.findById(trainer._id)
                
                .then((trainer) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(trainer);
                })            
            }, (err) => next(err));
        }
        else {
            err = new Error('trainer ' + req.params.trainerId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})


module.exports = trainerRouter;