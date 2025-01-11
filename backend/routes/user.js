const {Router} = require("express");
const { default: mongoose } = require("mongoose");
const jwt = require('jsonwebtoken'); 
const userRouter =  Router();
const zod = require('zod');
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { auth } = require("../auth");



const userSchema = zod.object({
    username:zod.string().email(),
    password:zod.string(),
    firstName:zod.string(),
    lastName:zod.string()
})

const updatedBody = zod.object({
    password:zod.string().optional(),
    firstName:zod.string().optional(),
    lastName:zod.string().optinoanl()
})

userRouter.post("/signup",async (req,res)=>{
     
    const response = userSchema.safeParse(req.body);
    const username=req.body.username;
    const password=rqe.body.password;
    const firstName= req.body.firstName;
    const lastName= req.body.lastName;

    if(response.success){
         
        const found = await User.findOne({username});

        if(!found){
            const user= await User.create({
                username,
                password,
                firstName,
                lastName
            })

            const userId=user._id;
            await Account.create({
                userId:userId,
                balance:1+ Math.random()*10000
            })
            const token= jwt.sign({userId: user._id},JWT_SECRET)
            return res.status(200 ).json({
                msg:"Email Created Succesfully ",
                token
             })
        }
        else{
            return res.status(411).json({
                msg:"Email Alraedy taken/Incorrect Inputs"
            })
       
    }
}  else{
        return res.status(411).json({
            msg:"Email Alraedy taken/Incorrect Inputs"
        })
    }

})
const siginBody = zod.object({
    username:zod.string().email(),
    password:zod.string()
})

userRouter.post("/signin",async(req,res)=>{
    const {success} = siginBody(req.body);

    if(!success){
        return res.status(411).json({
            msg:"Email Already taken or invalid inputs"
        })
    };
    const user = await User.findOne({
        username,
        password
    })
    if(user){
        const token = jwt.sign({
            userId:user._id
        },JWT_SECRET);

        res.json({
            token:token
        })
        return;
    }
    res.status(411).json({
        msg:"Error While logging in"
    })
    
    })




userRouter.put("/update",auth,async (req,res)=>{
       const {success}=updatedBody.safeParse(req.body);
       const userId= req.userId;

       if(!success){
        return res.status(411).json({
            msg:"Error While Updating Information "
        })
       }

       await User.findOneAndUpdate({userId},req.body)

       return res.json({
        msg:"User Updated Sucessfully"
       })

})
  
userRouter.get("/bulk",auth,async (req,res)=>{
     const filter= req.query.filter || "";
     const users= await User.find({$or: [
        {firstName: {
            "$regex":filter}
        
       }
        ,
        {lastName: {
            "$regex":filter}
        }
      ]})

      if(!user){
       return res.status(404).json({
            msg:"User Not Found"
        })
      }else{
            
        return res.status(200).json({
           user:users.map(user=>({
            username:user.username,
            firstName:user.firstName,
            lastName:user.lastName,
            id:user._id
           }))
        })

      }

})

module.exports={
    userRouter
}
