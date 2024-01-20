//Install required package/driver
// const mongodb = require("mongodb")
// const MongoClient = mongodb.MongoClient

const {MongoClient , ObjectId} = require("mongodb")
const id = new ObjectId()

// console.log(id)
// console.log(id.id)
// console.log(id.id.length)
// console.log(id.toHexString().length)
// console.log(id.getTimestamp())

//Required Parameters 
const connectionURL = "mongodb://0.0.0.0:27017"
const dbName = "task-manager"

//Establish the connection 
MongoClient.connect(connectionURL).then((client)=>{
    console.log("Successfully connected.")

    const db = client.db(dbName)
    
    // Insert document in the user collection
    // db.collection("user").insertOne({
    //     _id:id,
    //     name:"ammi",
    //     age:18,
    // } )


    // db.collection("user").insertMany([
    //     {
    //         name:"ajmal",
    //         age:19
    //     },{
    //         name:"nargis",
    //         age:20
    //     }
    // ], (error, result)=>{
    //     if(error){
    //         return console.log(error)
    //     }
    //     console.log(result.insertedIds)
    // })

    // db.collection("task").insertMany([{
    //     description:"Cleaning task",
    //     completed:true,
    // },{
    //     description:"study task",
    //     completed:false
    // },{
    //     description:"gaming task",
    //     completed:false
    // }])

    // db.collection("user").findOne({name:"abbas" , age: 19}).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    // db.collection("user").find({age:19}).toArray().then((users)=>{
    //     console.log(users)
    // }).catch((error)=>{
    //     throw error
    // })

    
    // db.collection("user").countDocuments({age:19}).then((count)=>{
    //     console.log(count)
    // }).catch((error)=>{
    //     throw error
    // })


    // db.collection("task").findOne({_id:new ObjectId("658fc6a344128f340b9576e0")}).then((id)=>{
    //     console.log(id)     
    // }).catch((error)=>{
    //     console.log(error)
    // })

    // db.collection("task").find({completed:false}).toArray().then((incompletedTasks)=>{
    //     console.log(incompletedTasks)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    // db.collection("task").countDocuments({completed:false}).then((incompletedTasks)=>{
    //     console.log(incompletedTasks)
    // }).catch((error)=>{
    //     console.log(error)
    // })


    // db.collection("user").updateOne({name:"nargis"} ,{$set:{age:17}}).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    // db.collection("user").updateMany({name:"nargis"} , {$set:{name:"faisal"}}).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    // db.collection("user").updateOne({name:"faisal"}, {$inc:{age:1}}).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    // db.collection("user").updateMany({name:"abbas"} , {$inc:{age:1}}).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    db.collection("user").deleteMany({name:"abbas"}).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })

    db.collection("user").find({}).toArray().then((result)=>{
        console.log(result) 
    }).catch((error)=>{
        console.log(error)
    })


}).catch((error)=>{
    console.log(error)
})