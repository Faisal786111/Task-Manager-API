require("../src/db/mongoose");
const Task = require("../src/models/task");

// Task.findByIdAndDelete("65914efa593c820f5057d239").then((tasks)=>{  
//     console.log(tasks)
//     return Task.countDocuments({completed:false})
// }).then((tasks)=>{
//     console.log(tasks);
// }).catch((error)=>{
//     console.log(error);
// })


// Async / Await

const deleteId = async(id , completed)=>{
    const doc = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({completed})
    return count;
}

deleteId("659f7e5a05a68bac9608cecf", false).then((count)=>{
    console.log(count);
}).catch((error)=>{
    console.log(error);
})

