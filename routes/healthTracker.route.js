const healthTrackerController = require("../controllers/healthTracker.controller");
const {authJwt} = require("../middlewares")

module.exports = (app) =>{

    //CREATE CALL
    app.post("/health/api/v1/records",[authJwt.verifyToken],healthTrackerController.create);

    // GET ALL RECORDS
    app.get("/health/api/v1/records",[authJwt.verifyToken,authJwt.isAdminOrOwner],healthTrackerController.getAllRecords);

    //GET SINGLE RECORDS
    app.get("/health/api/v1/records/:id",[authJwt.verifyToken,authJwt.isValidUserIdInReqParam,authJwt.isAdminOrOwner],healthTrackerController.getOneRecord);

    //UPDATE RECORDS
    app.put("/health/api/v1/records/:id",[authJwt.verifyToken,authJwt.isValidUserIdInReqParam,authJwt.isAdmin],healthTrackerController.update);

    //DELETE CALL
    app.delete("/health/api/v1/records/:id",[authJwt.verifyToken,authJwt.isAdmin],healthTrackerController.deleteOne)
}