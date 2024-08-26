import http from "http";
import url from "url";
import jwt from "jsonwebtoken";
import { tasks } from "./content";
const PORT=3000;

let i=1,archive=[];
let usersData=[
    {
        emailAddress:"john@gmail.com",
        password:"john123"
    },
    {
        emailAddress:"smith@gmail.com",
        password:"smith123"
    },
    {
        emailAddress:"teena@gmail.com",
        password:"teena123"
    }
]

const server=http.createServer((req,res)=>{
    const path=url.parse(req.url,true);
    const method=req.method;
    const queryPara=path.query;
    const pathname=path.pathname.split("/");
    let num=+pathname[2];
    let data="";
    const secretKey="gdhjte73ghej"

    req.on("data",(chunk)=>{
        data+=chunk;
    });

//user login
// POST /users/login
    if(method==="POST" && pathname.length===3 && pathname[1]==="users" && pathname[2]==="login"){
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
                const token=jwt.sign({email:isUserPresent.emailAddress},secretKey,{expiresIn:'1h'});
                response(token,"Login Successful",200,res);

            }
            else{
                response("User not found",404,res)
            }
        })
    }
//get users profile
    // GET /users/profile
    else if(method==="GET" && pathname.length===3 && pathname[1]==="users" && pathname[2]==="profile"){
        const token= checkUserAuthentication(req,res);
        if(token){
            try{
                const decode=jwt.verify(token, secretKey);
                // console.log("decode=",decode);
                response(`welcome ${decode.email}`,200,res)

            }
            catch(err){
                response("invalid token",401,res);
            }
        }
    }
/*1>create a new task*/
    //post /tasks
       else if(method==="POST" && pathname.length===2 && pathname[1]==="tasks" ){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                    req.on("end",()=>{
                    const body=JSON.parse(data);
                    body.id=i++;
                    body.history=[];
                    body.archive=false;
                    tasks.push(body);
                    response(body,"Task added",201,res)
                });
            }
            catch(err){
                response("invalid token",401,res);
            }
        }
    }
    
/*2>get all task*/
    //GET /tasks
    else if(method==="GET" && pathname.length===2 && pathname[1]==="tasks"){
        const token=checkUserAuthentication(req,res);
        if(token){
        try{
            let num=0,array=[];
            if(tasks.length!=0){
                for(let abc in queryPara){
                    num++;
                }
                if(num==0){
                    response(tasks,"Task api called",200,res)
                }
                //logic for query parameter
                else{
                    tasks.forEach((para)=>{
                        for(let temp in para){
                            if(para[temp]===queryPara[temp]){
                                array.push(para);
                            }
                        }
                    })
                    response(array,"Task api called",200,res)
                }
            }
            else{
                response("tasks is empty",404,res)
            }
        }
        catch(err){
            response("invalid token",401,res);
        }
    }
}
/*3>get a specific task by id*/
    //GET /tasks/:id
   else if(method==="GET" && pathname.length===3 && pathname[1]==="tasks" && num>0){
    const token=checkUserAuthentication(req,res);
    if(token){
        try{
            let k=0;
                tasks.forEach((ele)=>{
                    if(ele.id==pathname[2]){
                        k++;
                        response(ele,"Task api called",200,res)
                    }
                });
                checkNotFound(k,res);           
            }
            catch(err){
                response("invalid token",401,res);
            }
        }
   }

/*4>update the task*/
    //PUT /tasks/:id
    else if(method==="PUT" && pathname.length===3 && pathname[1]==="tasks"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let k=0;
                req.on("end",()=>{
                    let body=JSON.parse(data);
                    tasks.forEach((para)=>{
                        if(para.id==pathname[2]){
                            for(let element in body){
                            para[element]=body[element];
                            }
                            k++;
                            response(para,"task updated",200,res);
                        }
                    })
                    checkNotFound(k,res);           
                })
            }
            catch(err){
                response("invalid token",401,res);
            }
        }
    }

    
/*5>delete a task by id*/
    // DELETE /tasks/:id
    else if(method==="DELETE" && pathname.length===3 && pathname[1]==="tasks" && num>0){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let k=0;
                tasks.forEach((para)=>{
                    if(para.id==pathname[2]){
                        tasks.splice(tasks.indexOf(para),1);
                        k++;
                        response("task deleted",200,res);
                    }
                })
                checkNotFound(k,res);           
            }
            catch(err){
                response("invalid token",401,res);
            }
        }
    }

/*6>Task prioritization*/
    //PATCH /tasks/:id/priority
    else if(method==="PATCH" && pathname.length===4 && pathname[1]==="tasks" && pathname[3]==="priority"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let k=0;
                req.on("end",()=>{ 
                  let body=JSON.parse(data);
                    tasks.forEach((para)=>{
                        if(para.id==pathname[2]){
                            let status=para.priority;
                            para.priority=body.priority;
                            k++;
                            para.history.push({timeStamp:`${new Date()}`,change:`priority is changed form ${status} to ${body.priority}`,changedBy:para.assignedTo})
                            response(body,"priority updated",200,res);  
                        }
                    })
                    checkNotFound(k,res);           
                })
            }
            catch(err){
                response("invalid token",401,res);
            }
        }
    }

/*7>Assign task to user*/
    //PATCH /tasks/:id/assign
    else if(method==="PATCH" && pathname.length===4 && pathname[1]==="tasks" && pathname[3]==="assign"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let k=0;
                req.on("end",()=>{
                  let body=JSON.parse(data);
                    tasks.forEach((para)=>{
                        if(para.id==pathname[2]){
                            para.assignedTo= body.assignedTo; 
                            k++;
                            response(body,"task assigned",200,res);                 
                        }
                    })
                    checkNotFound(k,res);           
                })
            }
            catch(err){
                response("invalid token",401,res);
            }
        }
    }

/*8>Unassign task */
   //PATCH /tasks/:id/unassign
   else if(method==="PATCH" && pathname.length===4 && pathname[1]==="tasks" && pathname[3]==="unassign"){
    const token=checkUserAuthentication(req,res);
    if(token){
        try{
            let k=0;
            tasks.forEach((para)=>{
                if(para.id==pathname[2]){
                    para.assignedTo=null;
                    k++;
                    response(para,"task unassigned",200,res);                 
                }
            })
            checkNotFound(k,res);           
           }
           catch(err){
            response("invalid token",401,res);
        }
    }
}

/*9>categorize tasks*/ 
    //PATCH /tasks/:id/categorize
    else if(method==="PATCH" && pathname.length===4 && pathname[1]==="tasks" && pathname[3]==="categorize"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let k=0;
                req.on("end",()=>{
                   let body=JSON.parse(data);
                    tasks.forEach((para)=>{
                        if(para.id==pathname[2]){
                            k++;
                            para.category= body.category; 
                            response(body,"task categorized",200,res);                 
                        }
                    })    
                    checkNotFound(k,res);           
                })
        }
        catch(err){
            response("invalid token",401,res);
        }
    }
}

/*10>history*/
    //GET /tasks/:id/history
    else if(method==="GET" && pathname.length===4 && pathname[1]==="tasks" && pathname[3]==="history"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let k=0;
                tasks.forEach((para)=>{
                    if(para.id==pathname[2]){
                        k++;
                        response(para.history,"task history",200,res);                 
                    }
                })
                checkNotFound(k,res);           
            }
            catch(err){
                response("invalid token",401,res);
            }
        }
}


/*11>Task commenting*/
    //POST /tasks/:id/comments
    else if(method==="POST" && pathname.length===4 && pathname[1]==="tasks" && pathname[3]==="comments"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let k=0;
                req.on("end",()=>{
                   let body=JSON.parse(data);
                    tasks.forEach((para)=>{
                        if(para.id==pathname[2]){
                            para.comments=body
                            k++;
                            response(body,"comment created",201,res);                 
                        }
                    })
                    checkNotFound(k,res);           
                })  
            }
            catch(err){
                response("invalid token",401,res);
            }
        }
}

/*12>search tasks*/
    //GET /tasks/search
    else if(method==="GET" && pathname.length===3 && pathname[1]==="tasks" && pathname[2]==="search"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let arr=[];
                tasks.forEach((para)=>{
                    if(para.title==queryPara.q || para.description==queryPara.q){
                        arr.push(para)
                    }       
                })
                response(arr,"task searched",200,res);                 
            }
            catch(err){
                response("invalid token",401,res);
            }
        }
    }
/*13>Task completion*/
    //PATCH /tasks/:id/complete
    else if(method==="PATCH" && pathname.length===4 && pathname[1]==="tasks" && pathname[3]==="complete"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let k=0;
                tasks.forEach((para)=>{
                    if(para.id==pathname[2]){
                        k++;
                        let status=para.status;
                        para.status="completed";
                        response(para,"task completed",200,res);      
                        para.history.push({timeStamp:new Date(),change:`status changed form ${status} to ${para.status}`})           
                    }
                })
                checkNotFound(k,res);           
            }
            catch(err){
                response("invalid token",401,res);
            }
        }
}

/*14>complete all pending tasks*/
    //PATCH /tasks/complete-all
    else if(method==="PATCH" && pathname.length===3 && pathname[1]==="tasks" && pathname[2]==="complete-all"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let arr=[];
                tasks.forEach((para)=>{
                    if(para.status!="completed"){
                        para.status="completed";
                        arr.push(para);
                    }
                })
                response(arr,"all task completed",200,res);                 
            }
            catch(err){
                response("invalid token",401,res);
            }
        }
}
    
/*15>Delete all completed tasks*/
    //DELETE /tasks/delete-completed
    else if(method==="DELETE" && pathname.length===3 && pathname[1]==="tasks" && pathname[2]==="delete-completed"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let count=0,j=0;
                tasks.forEach((para)=>{
                    if(para.status==="completed"){
                            j++;
                }})
                recursive();
                function recursive(){
                    tasks.forEach((para)=>{
                        if(para.status==="completed"){
                            tasks.splice(tasks.indexOf(para),1);
                            count++
                        }
                    })
                    if(j!=0){
                        j--;
                        recursive();
                    }
                } 
                response(`deleted count=${count}`,"all completed tasks deleted",200,res);                 
            }
            catch(err){
                response("invalid token",401,res);
            }
        }
}

/*16>due date remainder*/
    //GET /tasks/due-soon
    else if(method==="GET" && pathname.length===3 && pathname[1]==="tasks" && pathname[2]==="due-soon"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let arr=[];
                tasks.forEach((para)=>{
                    let date1=new Date();
                    let date2=new Date(para.dueDate);
                    let diff=date2.getTime()-date1.getTime();
                    let dayDiff=Math.floor(diff/(1000*60*60*24));
                    if(dayDiff<=7 && dayDiff>=0){
                        arr.push(para);
                    }
                })
                response(arr,"due soon tasks",200,res);                 
            }
            catch(err){
                response("invalid token",401,res);
            }
        }
}

/*17>overdue tasks*/
    //GET /tasks/overdue
    else if(method==="GET" && pathname.length===3 && pathname[1]==="tasks" && pathname[2]==="overdue"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let arr=[];
                tasks.forEach((para)=>{
                    let date1=new Date();
                    let date2=new Date(para.dueDate);
                    let diff=date2.getTime()-date1.getTime();
                    let dayDiff=Math.floor(diff/(1000*60*60*24));
                    if(dayDiff<0){
                        arr.push(para);
                    }
                })
                response(arr,"overdue tasks",200,res);                 
            }
            catch(err){
                response("invalid token",401,res);
            }
        }
}

/*18>Task duplication*/
    //POST /tasks/:id/duplicate
    else if(method==="POST" && pathname.length===4 && pathname[1]==="tasks" && pathname[3]==="duplicate"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let k=0,arr;
                tasks.forEach((para)=>{
                    if(para.id==pathname[2]){
                        k++;
                        arr={...para}
                        arr.id=i++;
                        tasks.push(arr);
                        console.log(i);
                        response(para,"duplicate completed",200,res);                 
                    }
                })
                // checkNotFound(k,res);                           
            }
            catch(err){
                response("invalid token",401,res);
            }
        }
}

/*19>Archive completed tasks*/
    //PATCH /tasks/id/archive
    else if(method==="PATCH" && pathname.length===4 && pathname[1]==="tasks" && pathname[3]==="archive"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let k=0;
                tasks.forEach((para)=>{
                    if(para.id==pathname[2] && para.status==="completed"){
                        archive.push(para);
                        archive.archive=true;
                        tasks.splice(tasks.indexOf(para),1);
                        k++;
                        response(archive,"task archived",200,res);            
                    }
                })
                checkNotFound(k,res);           
            }
            catch(err){
                response("invalid token",401,res);
            }
        }
}

/*20>task sharing*/
    //POST /tasks/:id/share
    else if(method==="POST" && pathname.length===4 && pathname[1]==="tasks" && pathname[3]==="share"){
        let k=0;
    }

/*21>Bulk task creation*/
    //POST /tasks/bulk
    else if(method==="POST" && pathname.length===3 & pathname[1]==="tasks" && pathname[2]==="bulk"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let arr=[];
                req.on("end",()=>{
                    let body=JSON.parse(data);
                    body.forEach((para)=>{
                        para.id=i++;
                        tasks.push(para);
                        arr.push(para)
                    })
                    response(arr,"bulk task created",200,res);                 
                })
            }
            catch(err){
                response("invalid token",401,res);
            }
        }
}

//else others
    else{
        response("API not found",404,res);                 
    }

})

function checkUserAuthentication(req,res){
    const header=req.headers['authorization'];
    const token=header && header.split(' ')[1];
    if(!token){
        res.writeHead(401, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: 'Unauthorized' }));
    }
    return token;
}
function response(...resp){
    if(resp.length===4){
        resp[3].writeHead(resp[2],{'Content-Type':'application/json'});
        resp[3].end(JSON.stringify({message:resp[1],data:resp[0]}));
    }
    else{
        resp[2].writeHead(resp[1],{'Content-Type':'application/json'});
        resp[2].end(JSON.stringify({message:resp[0]}));
    }
}

function checkNotFound(k,res){
    if(k===0){
        response("Task not found",404,res)
    } 
}

server.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
});

