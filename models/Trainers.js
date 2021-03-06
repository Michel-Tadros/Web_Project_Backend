const mongoose = require ("mongoose");
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const trainerSchema = new Schema({
    User_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        unique:"true",
    },
    firstname:{
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
    email:{
        type:String,
        default:"No email was provided",
        
    },
    price:{
        type:Currency,
        required:true,
        min:0
    },
});


var Trainers=mongoose.model('Trainers',trainerSchema,'Trainers');
module.exports=Trainers;