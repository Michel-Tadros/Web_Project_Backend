const mongoose = require ("mongoose");
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);

const adminSchema = new Schema({
    User_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        
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
    username:{
        type:String,
    },
});


var Admins=mongoose.model('Admins',adminSchema,'Admins');
module.exports=Admins;