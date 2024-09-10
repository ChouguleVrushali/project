import http from "http";
import { UserController } from "./controller/userController";
import { TasksController } from "./controller/tasksController";
import { decodeURL } from "./utility/utilityFunc";

const server=http.createServer((req,res)=>{
    const {pathSegments}=decodeURL(req.url);

    if(pathSegments[1]==="users"){
        return new UserController().controller(req,res);
    }
    else if(pathSegments[1]==="tasks"){
        return new TasksController().controller(req,res);
    }
    else{
        return response("API not found",404,res);                 
    }
});


server.listen(process.env.PORT,()=>{
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
