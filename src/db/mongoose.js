// Install the required package
const mongoose = require("mongoose")

// Establish connection with MongoDB Database
mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("database is connected!");
}).catch((error)=>{
    console.log(error);
});

