import http from "http";
import url from "url";
import { UserController } from "./controller/userController";
import { TasksController } from "./controller/tasksController";
import 'dotenv/config'
import { decodeURL } from "./utility/utilityFunc";

console.log(process.env.PORT);

    const server=http.createServer((req,res)=>{
    const {pathSegments}=decodeURL(req.url);
    const method=req.method;

    if(pathSegments[1]==="users"){
        return new UserController().controller(req,res);
    }
    else if(pathSegments[1]==="tasks"){
        new TasksController().controller(req,res);
    }
    else{
       return response("API not found",404,res);                 
    }
});


server.listen(process.env.PORT,()=>{
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
