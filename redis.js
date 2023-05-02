const Redis=require("ioredis")
require("dotenv").config()

const configuartion={
    port:18530,
    host:"redis-18530.c305.ap-south-1-1.ec2.cloud.redislabs.com",
    username:"default",
    password:process.env.redis_Key
}


const redis=new Redis(configuartion)

module.exports={redis}