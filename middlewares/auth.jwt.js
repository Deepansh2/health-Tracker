const jwt = require("jsonwebtoken")
const authConfig = require("../configs/auth.config");
const User = require("../models/user.model")
const constants = require("../utils/constant")

const verifyToken = (req,res,next) =>{

    const token = req.headers["x-access-token"];
    
    if(!token){
        return res.status(403).send({
            message : " Access Probhited! No token provided"
        })
    }
    jwt.verify(token,authConfig.secret, (err,decoded) =>{
        if(err){
            res.status(401).send({
                message: "Unauthorized !"
            })
        }
        req.userId = decoded.id;
        next()
    })

}

const isAdmin =  async (req,res,next) =>{


    const user = await User.findOne({userId:req.body.userId});

    if(user.userType == constants.userTypes.admin){
         next();
    }
    else{
        res.status(403).send({
            message : "Only admin user allowed to access this endPoint"
        })
    }
}

const isValidUserIdInReqParam = async (req,res,next) =>{
    try{
    const user = await User.find({userId:req.params.id});

    if(!user){
        res.status(400).send({
            message: "UserId passed doesn't exist"
        })
    }
    next()
}catch(err){
    console.log("Error while reading the user Info",err.message);
    res.status(500).send({
        message: "Internal server error"
    })
}
}

const isAdminOrOwner = async (req,res,next) =>{


    try{
    const user = await User.findOne({userId:req.userId});
    if(user.userType == constants.userTypes.admin || req.params.id == user.userId){
        next()
    }
    else{
        return res.status(403).send({
            message : "Only admin or the owner is allowed to access this endPoint"
        })
    }
}catch(err){
    console.log("Error while reading the user Info",err.message);
    return res.status(500).send({
        message: "Internal server error"
    })
}
}

const authJwt = {
    verifyToken:verifyToken,
    isAdmin:isAdmin,
    isValidUserIdInReqParam :isValidUserIdInReqParam ,
    isAdminOrOwner:isAdminOrOwner
}
module.exports = authJwt