/** this is going to be the starting point of the
 * application
 */
 const express = require('express');
 const app = express();
 const serverConfig = require('./configs/server.config')
 const bodyParser = require("body-parser");
 const mongoose = require("mongoose");
 const dbConfig = require("./configs/db.config");
 const User = require("./models/user.model");
 const bcrypt = require("bcryptjs")
 /**
  * Register the body-parser middleware
  */
 app.use(bodyParser.json()); // Register the bodyParser
 app.use(bodyParser.urlencoded({extended : true}));// Register the bodyParser
 
 
 /**
 *Initialize the connection to the mongodb 
 */
 mongoose.connect(dbConfig.DB_URL);
 const db = mongoose.connection;
 db.on("error",()=>{
     console.log("Error while connecting to MongoDB");
 });
 db.once("open",()=>{
     console.log("Connected to mongoDB")
     init();
 })
 
 /**   
  * Create the ADMIN user at the boot time
  */
 
 async function init(){
 
     /**
      * Check if the admin user is already present
      */
     try{
 
         /** 
          * Every time the server starts the collectoin should be refereshed
          * 
          */
 
         await User.collection.drop()
     /**let user = await User.findOne({userId : "admin"});
     
     if(user){
         console.log("ADMIN user is already present");
         return;
     }*/
 
     const user = await User.create({
         name : "Deepanshu",
         userId : "admin",
         password : bcrypt.hashSync("Welcome",8),
         email : "deepanshusing54@gmail.com",
         userType : "ADMIN"
     });
     console.log(user);
 }catch(err){
     console.log("err in db initialization, " +err.message)
 }
 
 }
 
 
 /**  
 *we need to connect router to the server
 */
 require("./routes/auth.route")(app);//this registers server with route
 require("./routes/user.route")(app);
 require("./routes/healthTracker.route")(app);
 
 /**
  * So this can be used for the integration testing
  */
 module.exports = app.listen(serverConfig.PORT, ()=>{
     console.log("Started the server on the Port number : ",serverConfig.PORT);
 });