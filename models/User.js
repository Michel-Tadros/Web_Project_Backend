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
    phonenumber:{
        type:Number,


    },
    gender:{
        type:String,
        default:'M or F',
        min:'M',
        max:'F',

    },

    email:{
        type:String,
        default:"No email was provided",
        unique:true,
    },
    date_of_birth:{
        type:Date,
        max:Date.now
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