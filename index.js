const express=require("express")
const { connection } = require("./connection/db")
const { userRouter } = require("./Routes/user.routes")
const { IpRouter } = require("./Routes/IP.routes")
const { auth } = require("./middleware/auth")
const winston=require("winston")
const expressWinston=require("express-winston")
require("winston-mongodb")

require("dotenv").config()

const app=express()
app.use(express.json())

app.use(expressWinston.logger({
    transports:[
        new winston.transports.MongoDB({
            db:"mongodb://localhost:27017/logs",
            level:"error",
            json:true,
            colorize:true
            
        })
    ],
    format:winston.format.prettyPrint()
}))



app.use("/user",userRouter)
app.use(auth)
app.use("/ip",IpRouter)






app.listen(process.env.port,async()=>{
    await connection
    console.log("connected to port")
})