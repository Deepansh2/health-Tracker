const Health = require("../models/healthTracker.model")
const User = require("../models/user.model")
const constants = require("../utils/constant")


exports.create = async (req,res) =>{

    const healthObj = {
        height:req.body.height,
        weight:req.body.weight,
        userId :req.body.userId,
        bloodPressure:req.body.bloodPressure,
        sugurLevel:req.body.sugurLevel,
        temperature:req.body.temperature,
        symptoms:req.body.symptoms,
        age:req.body.age
    }
    try{
    const healthTrackerCreated = await Health.create(healthObj);
    if(healthTrackerCreated){
        const patient = await User.findOne({userId:req.userId});
        patient.userReports.push(healthTrackerCreated._id);
        await patient.save()
        res.status(201).send(healthTrackerCreated)
    }

}catch(err){
    console.log("Error while doing db operation ",err.message);
    res.status(500).send({
        message: "Internal server error"
    })
}

}

exports.getAllRecords = async (req,res) =>{

    const user = await User.findOne({userId:req.userId});

    const queryObj=  {}
    const userReports = user.userReports
    if(user.userType == constants.userTypes.patient){
        if(!userReports){
            return res.status(200).send({
                message : "No reports are persent"
            })
        }
        queryObj["_id"] = { $in:userReports}
    }
    const healths  = await Health.find(queryObj)
    res.status(200).send(healths)
}


exports.getOneRecord  = async (req,res) =>{

    const health = await Health.findOne({userId:req.params.id});

    res.status(200).send(health)
}

exports.update = async (req,res)  =>{

    try{
    const user = await User.findOne({"_Id":req.params.id});
    user.height = req.body.height != undefined?req.body.height:user.height;
    user.age = req.body.age != undefined?req.body.age:user.age;
    user.bloodPressure = req.body.bloodPressure != undefined?req.body.bloodPressure:user.bloodPressure;
    user.sugurLevel = req.body.sugurLevel != undefined? req.body.sugurLevel:user.sugurLevel;
    user.symptoms = req.body.symptoms != undefined?req.body.symptoms:user.symptoms;
    user.temperature = req.body.temperature != undefined? req.body.temperature:user.temperature;

    const updatedRecord = await user.save();
    res.status(200).send(updatedRecord)
    }catch(err){
        console.log("Some error while updating records",err.message);
        res.status(500).send({
            message: "Internal server error"
        })
    }
}


exports.deleteOne = (req,res) =>{
    

    try{
    const health = await Health.deleteOne({userId:req.params.id})
    if(health == null){
        return res.status(400).send({
            message : "health Record doesn't exist"
        })
    }

    return res.status(200).send(health)
}catch(err){
    console.log("Error while deleting records",err.message);
    return res.status(500).send({
        message : "Some internal  server error"
    })
}
    
}