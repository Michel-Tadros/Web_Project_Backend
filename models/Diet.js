const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const dietSchema = new Schema({
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
    dietician:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
      
    },
    
});

var diets=mongoose.model('diet',dietSchema,'Diets');
module.exports=diets;