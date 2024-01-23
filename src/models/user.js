const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("../models/task");

const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        trime : true,
    },
    email :{
        type : String,
        required : true,
        unique:true,
        trim : true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid.");
            }
        }
    },
    password : {
        type : String,
        required: true,
        trim : true,
        minLength: 7,
        validate(value){
           
            if(validator.equals(value.toLowerCase(), "password")){
                throw new Error("Password should not contain password.");
            }
        }
    },
    age : {
        type : Number,
        required : true,
        default : 0,
        validate(value){
            if(value<0){
                throw new Error("age should be greater than zero!");
            }
        }
    }, 
    tokens :[
        {
            token : {
                type:String,
                required : true
            }
        }
    ],
    avatar : {
        type : Buffer
    }
} , {
    timestamps : true
});

//Setting up Virtual property between User & Task Entities
userSchema.virtual("tasks",{
    ref:"Task",
    localField:"_id",
    foreignField:"owner"
})

// Hiding private Data
userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token  = jwt.sign({"_id":user._id.toString()} , "thisismynewcourse");
    user.tokens.push({ token });
    await user.save(); 
    return token;
}

//create findByCredentials method 
userSchema.statics.findByCredentials =  async (email , password)=>{
    
    const user = await User.findOne({email});

    if(!user){
        throw new Error("Unable to login!");
    }

    const isMatch = await bcrypt.compare(password , user.password);

   
    if(!isMatch){
        throw new Error("Unable to login!");
    }

    return user;

}

//this -> reference of document that is about to be saved.
//example : {name : "faisal" , email :"faisalkhanisrar@gmail.com"}

//Hash plan text before saving
userSchema.pre("save" , async function(next){
    const user = this;

    try{
        if(user.isModified("password")){
            user.password = await bcrypt.hash(user.password , 8);
        }
        next();
    }catch(e){
        console.log(e);
    }
    
});

//Delete all the Tasks of user 
userSchema.pre('remove',async function(next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    console.log("this is working");
    next();
  });


const User = mongoose.model("User" , userSchema);

module.exports = User;