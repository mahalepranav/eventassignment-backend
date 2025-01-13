const mongoose = require("mongoose");


const connectDB = async () =>{
    try{
        mongoose.connect("mongodb://127.0.0.1:27017/eventDB")
        console.log("database connected successfully")
    }catch(err){
        console.log("error in connecting with db", err)
    }
}

module.exports = connectDB