const mongoose=require("mongoose")

const visitSchema=mongoose.Schema({
    userID:String,
    visitedIP:Array,
 

})

const visitModel=mongoose.model("visit",visitSchema)

module.exports={visitModel}