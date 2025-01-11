const {Router}= require("express");
const { auth } = require("../auth");
const { Account } = require("../db");
const { default: mongoose } = require("mongoose");

const accountRouter = Router();


accountRouter.get("/balance",auth,async (req,res)=>{
    const userId = req.userId;

    const account= await Account.findOne({userId});

         return res.status(200).json({
            balance:account .balance
        })
   
})

accountRouter.post("/transfere",auth,async (req,res)=>{
    const session = await mongoose.startSession();

    const{amount, to} = req.body;

    const account= await Account.findOne({
        userId:req.userId
    }).session(session);

    if(!account || account.balance<amount){
        await session.abortTransaction();
        return res.status(400).json({
           msg:"Insufficient Balance"
        })
    }

    const toAccount = await Account.findOne({userId:to}).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            msg:"Invalid Account "
        })
    }

    await Account.updateOne({userId:req.userId},{
           $inc:{balance:-amount} }).session(session);

    await Account.updateOne({userId:to},{
          $inc:{balance:amount} }).session(session);

      await session.commitTransaction();

      return res.status(200).json({
        msg:"Successful Transaction"
      })
})

module.exports= {
    accountRouter
}