var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    firstname:{
        type:String,
        default:'firstname '
    },
    lastname:{
        type:String,
        default:'lastname '
    },
    gender:{
        type:String,
        default:'M or F',
        min:'M',
        max:'F',

    },
    height:{
        type:Number,
        min:0,
        max:300,
        default:170
    },

    weight:{
        type:Number,
        min:0,
        default:65
    },

    email:{
        type:String,
        default:"No email was provided",
        
    },
    phonenumber:{
        type:Number,
        default:0
    },
    date_of_birth:{
        type:Date,
        default:Date.now
    },

    admin:   {
        type: Boolean,
        default: false
    },
    
    trainer:   {
        type: Boolean,
        default: false
    },
    dietician:   {
        type: Boolean,
        default: false
    },
    
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User,'User');