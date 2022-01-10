const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const workouts=require('../models/workout');
const cors = require('./cors');

const workoutRouter = express.Router();

workoutRouter.use(bodyParser.json());
var authenticate = require('../authenticate');

workoutRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})

.get(cors.cors,(req,res,next) => {
    workouts.find({})
    .populate('trainer','_id')
    .then((workouts)=>{
        res.statusCode=200;
        res.setHeader("Content-type","application/json");
        res.json(workouts);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyTrainer, (req, res, next) => {
    workouts.create(req.body)
    .then((workout)=>{
        workout.trainer=req.user._id;
        workout.save();
        console.log("workout created",workout);
        res.setHeader("Content-type","application/json");
        res.json(workout);
    },(err)=>next(err)).catch((err)=>next(err));
    
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyTrainer, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /workouts');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    workouts.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader("Content-type","application/json");
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

workoutRouter.route('/:workoutId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200);})

.get(cors.cors,(req,res,next) => {
    workouts.findById(req.params.workoutId)
    .populate('trainer','_id')
    
    .then((workout) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(workout);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyTrainer,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /workoutsId/'+ req.params.workoutId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyTrainer, (req, res, next) => {
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
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
    workouts.findByIdAndRemove(req.params.workoutId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


workoutRouter.route('/:trainer')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req,res,next) => {
        workouts.findById(req.user._id)
            .populate('trainer','_id')
            .then((workout) => {
                if (workout != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(workout.trainer);
                }
                else {
                    err = new Error('Trainer ' + req.params.workoutId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        workouts.findById(req.params.workoutId)
            .then((workout) => {
                if (workout != null) {
                    req.body.author = req.user._id;
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
                    err = new Error('Trainer ' + req.params.workoutId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /workouts/'
            + req.params.workoutId + '/trainer');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        workouts.findById(req.params.workoutId)
            .then((workout) => {
                if (workout != null) {
                    for (var i = (workout.trainer.length -1); i >= 0; i--) {
                        workout.trainer.id(workout.trainer[i]._id).remove();
                    }
                    workout.save()
                        .then((workout) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(workout);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Trainer ' + req.params.workoutId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });







workoutRouter.route('/:workoutId/trainer')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req,res,next) => {
        workouts.findById(req.params.workoutId)
            .populate('trainer','_id')
            .then((workout) => {
                if (workout != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(workout.trainer);
                }
                else {
                    err = new Error('Trainer ' + req.params.workoutId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        workouts.findById(req.params.workoutId)
            .then((workout) => {
                if (workout != null) {
                    req.body.author = req.user._id;
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
                    err = new Error('Trainer ' + req.params.workoutId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /workouts/'
            + req.params.workoutId + '/trainer');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        workouts.findById(req.params.workoutId)
            .then((workout) => {
                if (workout != null) {
                    for (var i = (workout.trainer.length -1); i >= 0; i--) {
                        workout.trainer.id(workout.trainer[i]._id).remove();
                    }
                    workout.save()
                        .then((workout) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(workout);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Trainer ' + req.params.workoutId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });





module.exports = workoutRouter;