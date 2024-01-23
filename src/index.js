const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const path = require('node:path');

const app = express();
const port = process.env.PORT;

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
   const token = jwt.sign({_id:"faisal"} , process.env.JWT_SECRET , {expiresIn: "7 days"});
   console.log(token);

   const data = jwt.verify(token , process.env.JWT_SECRET);
   console.log(data);
}

myFunction();

const multer = require("multer");
const upload = multer({
    dest : "images",
    limits : {
        fileSize:1000000 //1MB
    },
    fileFilter(req , file , cb){
        if(!file.originalname.match(/\.(docx|doc)$/)){
            return cb(new Error("Please upload a Word document."));
        }

        cb(undefined , true);
    }
});

app.post("/upload",upload.single("upload"),(req , res)=>{
    try{
        res.send("Image is uploaded");

    }catch(e){
        res.send(e.message);
    }
}, (error , req , res , next)=>{
    res.status(400).send(error.message);
})





app.listen(port , ()=>{
    console.log("Server is connected! "+ port);
})

