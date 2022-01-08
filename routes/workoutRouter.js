const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const workouts=require('../models/workout');


const workoutRouter = express.Router();

workoutRouter.use(bodyParser.json());
var authenticate = require('../authenticate');

workoutRouter.route('/')
.get((req,res,next) => {
    workouts.find({})
    .populate('trainer','_id')
    .then((workouts)=>{
        res.statusCode=200;
        res.setHeader("Content-type","application/json");
        res.json(workouts);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,authenticate.verifyTrainer, (req, res, next) => {
    workouts.create(req.body)
    .then((workout)=>{
        workout.trainer=req.user._id;
        workout.save();
        console.log("workout created",workout);
        res.setHeader("Content-type","application/json");
        res.json(workout);
    },(err)=>next(err)).catch((err)=>next(err));
    
})
.put(authenticate.verifyUser,authenticate.verifyTrainer, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /workouts');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    workouts.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader("Content-type","application/json");
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

workoutRouter.route('/:workoutId')
.get((req,res,next) => {
    workouts.findById(req.params.workoutId)
    .populate('trainer','_id')
    
    .then((workout) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(workout);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,authenticate.verifyTrainer,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /workoutsId/'+ req.params.workoutId);
})
.put(authenticate.verifyUser,authenticate.verifyTrainer, (req, res, next) => {
    workouts.findByIdAndUpdate(req.params.workoutId, {
        $set: req.body
    }, { new: true })
    .then((workout) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(workout);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    workouts.findByIdAndRemove(req.params.workoutId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

workoutRouter.route('/:workoutId/trainer')
.get((req,res,next) => {
    workouts.findById(req.params.workoutId)
    .populate('trainer','_id')
    .then((workout) => {
        if (workout != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(workout.trainer);
        }
        else {
            err = new Error('workout ' + req.params.workoutId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,authenticate.verifyTrainer, (req, res, next) => {
    workouts.findById(req.params.workoutId)
    .then((workout) => {
        if (workout != null) {
            req.body.trainer = req.user._id;
            workout.trainer.push(req.body);
            workout.save()
            .then((workout) => {
                workouts.findById(workout._id)
                .populate('trainer','_id')
                .then((workout) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(workout);
                })            
            }, (err) => next(err));
        }
        else {
            err = new Error('workout ' + req.params.workoutId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})


module.exports = workoutRouter;