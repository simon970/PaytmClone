import { JWT_SECRET } from "./config";
const jwt = require('jsonwebtoken'); 

export async function auth(req,res,next) {
    const authHeader = req.headers.authorization;

    if(!authHeader|| !authHeader.startswith('Bearer ')){
        return res.status(403).json({
            msg:"Invalid Authorization"
        })
    }
    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token,JWT_SECRET);

        if(decoded.userId){
            req.userId= decoded.userId;
            next();
        }
        return res.status(403).json({})
    }
       
    catch(err){
        return res.status(403).json({
            msg:"Incorrect Logins"
        })
    }
  
}
