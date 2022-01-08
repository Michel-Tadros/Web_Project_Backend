var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    firstname:{
        type:String,
        default:' '
    },
    lastname:{
        type:String,
        default:' '
    },
    admin:   {
        type: Boolean,
        default: false
    },
    date_of_birth:{
        type:Date,
        max:Date.now
    },
    trainer:   {
        type: Boolean,
        default: false
    },
    dietician:   {
        type: Boolean,
        default: false
    },
    phonenumber:{
        type:Number,

    }
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User,'User');