const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT || 3000;

//regist middleware
// app.use((req , res , next)=>{
//     if(req.method == "GET"){
//         res.send("Denied to access");
//     }else{
//         next();
//     }
// })

// app.use((req , res , next)=>{
//     res.status(503).send("Server is shutdown for maintenance ")
// })

//use Express json , user & task Router
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


const jwt = require("jsonwebtoken");

const myFunction = async ()=>{
   const token = jwt.sign({_id:"faisal"} , "faisal786" , {expiresIn: "7 days"});
   console.log(token);

   const data = jwt.verify(token , "faisal786");
   console.log(data);
}

myFunction();


app.listen(port , ()=>{
    console.log("Server is connected! "+ port);
})

const Task = require("./models/task");
const User = require("./models/user");

const main = async()=>{
      
    // const task =await Task.findById("65aa06a7538a18c27530ff7d");
    // await task.populate("owner");
    // console.log(task.owner);

    // const user = await User.findById("65aa05d1e7dfa10999210fd0");
    // await user.populate("tasks");
    // console.log(user.tasks);
}

main();
