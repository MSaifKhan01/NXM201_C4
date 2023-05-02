const express=require("express")

const jwt=require("jsonwebtoken")

const bcrypt=require("bcrypt")
const { userModel } = require("../Model/user.model")
const { redis } = require("../redis")

const userRouter=express.Router()


userRouter.post("/register",async(req,res)=>{
    const {name,email,password}=req.body
    try {
       
        const userPresent= await userModel.findOne({email})

        if(userPresent){
            return res.send({msg:"User already present"})
        }

        bcrypt.hash(password,3,async(err,hash)=>{
            const NewUser= new userModel({name,email,password:hash})
            await NewUser.save()
        })
        res.status(201).send({msg:"registration succesfull"})
    } catch (err) {
        res.status(401).send({msg:err.message})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try {
       
        const user=await userModel.findOne({email})
        if(!user){
            res.status(401).send({msg:"register first"})
        }
        bcrypt.compare(password,user.password,(err,result)=>{
            if(result){
                const token=jwt.sign({"userID":user._id},"jammi",{expiresIn:"1hr"})
                res.status(201).send({msg:"login succesfull",token})
            }else{
                res.status(401).send({msg:"login failed"})
            }
        })
    } catch (err) {
        res.status(401).send({msg:"login failed"})
    }
})

userRouter.post("/logout",async(req,res)=>{
    const token=req.headers.authorization
 
    if(!token){
        res.status(401).send({msg:"Token is not in headers"})
    }else{
        redis.set("token",token,"EX",60*200)
    }
   
    res.status(201).send({msg:"logout succesfull"})
})
module.exports={userRouter}