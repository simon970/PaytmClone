const mongoose = require("mongoose");
const { Schema} = require("zod");

await mongoose.connect("mongodb+srv://simonpaul496:m8MFa61EBtehzBaK@cluster0.a8zuj.mongodb.net/paytm");



const userSchema= mongoose.Schema({
    firstName: {
        type:String,
        required:true,
        lowercase:true
    },
    lasName: {
        type:String,
        required:true,
        lowercase:true
     },
    username:{
        type:String, 
        unique:true,
        required:true,
        unique:true,
        lowercase:true

    
    },
    password: {
        type:String,
        required:true,
        lowercase:true

    }

})


const accountSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
})

const User = mongoose.model("User",userSchema);
const Account= mongoose.model("Account",accountSchema);

module.exports={
     User,
     Account
}

