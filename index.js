const express = require("express");
const connectDB = require("./config/db");
const cors = require('cors');
const Eventrouter = require("./routes/eventRoute");
const Userrouter = require("./routes/userRoute");


const PORT = 8000;
const app = express()

app.use(express.json())
app.use(cors())



app.get("/", (req,res)=>{
    res.send("Hello world")
})

app.use('/api/v1/events', Eventrouter);
app.use('/api/v1/auth', Userrouter);

connectDB();

app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`)
})