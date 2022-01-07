const mongoose = require ("mongoose");
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const trainerSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true
    },
    phonenumber:{
        type:Number,
        required:true,
        unique:true
    },
    price:{
        type:Currency,
        required:true,
        min:0
    },
});

/**const workoutSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    trainer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    
});

var workouts=mongoose.model('workouts',workoutSchema,'Workouts');
module.exports=workouts;*/
var Trainers=mongoose.model('Trainers',trainerSchema,'Trainers');
module.exports=Trainers;