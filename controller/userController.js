import { usersData } from "../mockData/userMockData";
import jwt from 'jsonwebtoken';
import { response,checkUserAuthentication} from "../utility/authUtility";
import 'dotenv/config'
import { decodeURL } from "../utility/utilityFunc";
import { UserService } from "../services/userService";

let id=1;
export class UserController{
    constructor(){
        this.UserService=new UserService();
        }
    controller(req,res){
    const {pathSegments,pathLength}=decodeURL(req.url);
    const method=req.method;
    let data='';
    req.on('data',(chunk)=>{
        data+=chunk;
    })

    
//user login
// POST /users/login
if(method==="POST" && pathLength===3 && pathSegments[2]==="login"){
    req.on("end",()=>{
        const user=JSON.parse(data);
        user.id=id++;
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
    else if(method==="GET" && pathLength===3 && pathSegments[2]==="profile"){
        const token= checkUserAuthentication(req,res);
        if(token){
            try{
                const decode=jwt.verify(token, process.env.SECRET_KEY);
                response(`welcome ${decode.email}`,200,res)
            }
            catch(err){
                response("invalid token",401,res);
            }
        }
    }
//create profile
    else if(method==="POST" && pathLength===3 && pathSegments[2]==="create"){
        req.on("end",()=>{
            const body=JSON.parse(data);
            body.id=id++;
            let final=this.UserService.addUser(usersData,body)
            const token=jwt.sign({email:body.emailAddress},process.env.SECRET_KEY,{expiresIn:'1h'});
            return response([token,final],"user created successfully",201,res);
        })
    }

//update profile
// /users/1/update
    else if(method==="PUT" && pathLength===4 && pathSegments[3]==="update"){
        const token= checkUserAuthentication(req,res);
        if(token){
            req.on("end",()=>{
                const body=JSON.parse(data);
                let final=this.UserService.updateUser(usersData,body)
                return response(final,"user updated successfully",200,res);
            })
        }
    }

    //delete /users/1
    else if(method==="DELETE" && pathLength===3 ){
        const token=checkUserAuthentication(req,res);
        if(token){
            this.UserService.deleteUserById(usersData)
            return response("task deleted",200,res);        
    }
        }
}
}