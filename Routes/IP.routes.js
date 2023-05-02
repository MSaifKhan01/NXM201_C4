const express=require("express")

const axios=require("axios")
const { redis } = require("../redis")
const { visitModel } = require("../Model/visit.model")


const IpRouter=express()

IpRouter.get("/info",async(req,res)=>{
    const IP=req.query.IP
    const cachdata= await redis.get(IP)
    if(cachdata){
        console.log("from redis")

        res.status(200).send(cachdata)
    }else{
        const resp=await axios.get(`https://ipapi.co/${IP}/json/`)

        const data=resp.data
        redis.set(IP,JSON.stringify(data),"EX",6*60*60)
        console.log("from axios")
        await visitModel.findOneAndUpdate({userID:req.userID},{
            userID:req.userID,
            $push:{visitedIP:IP}
        },{new:true,upsert:true})
        res.status(200).send(data)
    }
})

IpRouter.get("/visitIp",async(req,res)=>{
    const visitedIP=await visitModel.findOne({userID:req.userID})
    res.status(200).send(visitedIP)
})

module.exports={IpRouter}