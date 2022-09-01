const mongoose = require("mongoose");


const healthSchema = new mongoose.Schema({
    height : {
        type: String,
        required: true
    },
    weight : {
        type : Number,
        required : true
    },
    userId : {
        type : String,
        required:true,
        unique:true
    },
    bloodPressure : {
        type : String,
        required: true
    },
    sugurLevel : {
        Type : String,
        required : true
    },
    temperature : {
        Type : Number,
        required : true
    },
    symptoms: {
        type : [String],
        required : true
    },

    age:{
        type:Number,
        required:true
    },
    createdAt : {
        type : Date,
        immutable : true,
        default : ()=>{
            return Date.now()
        }
    },
    updatedAt : {
        type : Date,
        default : ()=>{
            return Date.now()
        }
    }
});

module.exports = mongoose.model("healthTracker",healthSchema)