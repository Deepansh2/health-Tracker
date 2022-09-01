const User = require("../models/user.model")
const constants = require("../utils/constant")
const bcrypt = require("bcryptjs")

const authConfig = require("../configs/auth.config");
const jwt = require("jsonwebtoken")

exports.signup = async (req,res) =>{

    if(req.body.userType != constants.userTypes.patient){
        req.body.userStatus = constants.userStatus.pending
    }
    
    const userObj  = {
        name : req.body.name,
        userId : req.body.userId,
        password  : bcrypt.hashSync(req.body.password,8),
        email : req.body.email,
        userType: req.body.userType,
        userStatus: req.body.userStatus
    }

    try{
    const userCreated = await User.create(userObj);

    const userResponse = {
        name : userCreated.name,
        userId : userCreated.userId,
        email : userCreated.email,
        userStatus: userCreated.userStatus,
        userType: userCreated.userType,
        createdAt : userCreated.createdAt,
        updatedAt: userCreated.updatedAt
    }
    res.status(201).send(userResponse)
}catch(err){
    console.log("Some error happened while signup",err.message);
    res.status(500).send({
        message: "Internal server error"
    })
}

}


exports.signin = async (req,res) =>{

   
    try{
    const user = await User.findOne({userId: req.body.userId});
    
    if(user == null){
        res.status(400).send({
            message : "Failed ! userId passed doesn't exist"
        })
    }
    if(user.userStatus == constants.userStatus.pending){
        res.status(400).send({
            message: "Not yet approved by admin"
        })
    }

    const isValidPassword = bcrypt.compareSync(req.body.password,user.password)

    if(!isValidPassword){
        res.status(401).send({
            message : "Wrong password"
        })
    }
    const token = jwt.sign({
        id : user.userId
    },authConfig.secret,{
        expiresIn : 600
    });

    res.status(200).send({
        name : user.name,
        userId : user.userId,
        email: user.email,
        userStatus:user.userStatus,
        userType:user.userType,
        accessToken : token
    });

}catch(err){
    console.log("Some error happened while signin",err.message);
    res.status(500).send({
        message : "Some Interal server error"
    })
}
}