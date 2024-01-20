// Install the required package
const mongoose = require("mongoose")

// Establish connection with MongoDB Database
mongoose.connect("mongodb://0.0.0.0:27017/task-manager-API").then(()=>{
    console.log("database is connected!");
}).catch((error)=>{
    console.log(error);
});

