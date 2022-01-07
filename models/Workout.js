const mongoose = require ("mongoose");
const Schema = mongoose.Schema;
const trainer=require('../models/Trainers');
const workoutSchema = new Schema({
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
        default:"No description provided",
    },
    trainer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:"61d82bca2713260c72c9ecc7"
      
    },
    
});

var workouts=mongoose.model('workouts',workoutSchema,'Workouts');
module.exports=workouts;