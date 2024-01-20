require("../src/db/mongoose");
const User = require("../src/models/user");

// User.findByIdAndUpdate("659039f25e25559b6fc6f177" ,{age:1}).then((user)=>{
//     console.log(user);
//     return User.countDocuments({age:1});
// }).then((documents)=>{
//     console.log(documents);
// }).catch((error)=>{
//     console.log(error);
// })


const updateAgeAndCount = async (id , age)=>{
    const users = await User.findByIdAndUpdate(id , { age});
    const count = await User.countDocuments({age});
    return users;
}

updateAgeAndCount("659bc2596e73c8ff34ddb1cd" , 2).then((count)=>{
    console.log(count);
}).catch((error)=>{
    console.log(error);
})