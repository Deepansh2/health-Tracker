const mongoose = require("mongoose")
const constants = require("../utils/constant")

const userSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true
    },
    userId : {
        type : String,
        required : true,
        unique: true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required: true,
        lowercase : true,
        minLength : 10,
        unique : true
    },
    userType : {
        type : String,
        required : true,
        default : constants.userTypes.patient,
        enum: [constants.userTypes.patient,constants.userTypes.admin]
    },
    userStatus: {
        type : String,
        required : true,
        default : constants.userStatus.approved,
        enum : [constants.userStatus.pending,constants.userStatus.rejected,constants.userStatus.approved]
    },
    userReports : {
        type : [mongoose.SchemaTypes.ObjectId],
        ref : "healthTracker"
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

module.exports = mongoose.model("user",userSchema)