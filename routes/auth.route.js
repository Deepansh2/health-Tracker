const authController = require("../controllers/auth.controller")
const {verifySignUp} = require("../middlewares")
module.exports  = (app) =>{

    app.post("/health/api/v1/signup",[verifySignUp.validateSignUpRequestBody],authController.signup);

    app.post("/health/api/v1/signin",[verifySignUp.validateSignInRequestBody],authController.signin)
}