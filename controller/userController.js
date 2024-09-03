import { method,pathname,data } from "../app";
import { usersData } from "../mockData/userMockData";
import jwt from 'jsonwebtoken';
import { response } from "../utility/authUtility";
import { checkUserAuthentication } from "../utility/authUtility";
import 'dotenv/config'
import { decodeURL } from "../utility/utilityFunc";

export class UserController{
    controller(req,res){
//user login
// POST /users/login
if(method==="POST" && pathname.length===3 && pathname[2]==="login"){
    req.on("end",()=>{
        const user=JSON.parse(data);
        const isUserPresent=usersData.find((para)=>{
            if(para.emailAddress===user.emailAddress && para.password===user.password){
                return true;
            }
            else{
                return false;
            }
        })
        if(isUserPresent){
            const token=jwt.sign({email:isUserPresent.emailAddress},process.env.SECRET_KEY,{expiresIn:'1h'});
            return response(token,"Login Successful",200,res);
        }
        else{
            return response("User not found",404,res)
        }
    })
}
//get users profile
    // GET /users/profile
    else if(method==="GET" && pathname.length===3 && pathname[1]==="users" && pathname[2]==="profile"){
        const token= checkUserAuthentication(req,res);
        if(token){
            try{
                const decode=jwt.verify(token, process.env.SECRET_KEY);
                // console.log("decode=",decode);
                response(`welcome ${decode.email}`,200,res)
            }
            catch(err){
                response("invalid token",401,res);
            }
        }
    }
    }
    
}