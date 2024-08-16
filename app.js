import http from "http";
import url from "url";
const PORT=3000;

let i=1;
let tasks=[];

const server=http.createServer((req,res)=>{
    const path=url.parse(req.url,true);
    const method=req.method;
    const queryPara=path.query;
    // console.log(queryPara)
    const pathname=path.pathname.split("/");
    // console.log(pathname);
    
/*1>create a new task*/
    //post /tasks
    if(method==="POST" && pathname.length===2 && pathname[1]==="tasks" ){
        let data="";
        req.on("data",(chunk)=>{
            data+=chunk;
        });

        req.on("end",()=>{
            const Data=JSON.parse(data);
            Data.id=i++;
            tasks.push(Data);
            // console.log("tasks=",tasks);
            res.writeHead(201,{'Content-Type':'application/json'});
            res.end(JSON.stringify({message:"Task added",data:Data}));
        });
    }

/*2>get all task*/
    //GET /tasks
    if(method==="GET" && pathname.length===2 && pathname[1]==="tasks"){
        let num=0,array=[];
        if(tasks.length!=0){
            for(let abc in queryPara){
                num++;
                console.log("num=",num)
            }
            if(num==0){
                res.writeHead(200,{'Content-Type':'application/json'});  
                res.end(JSON.stringify({message:"Task api called",data:tasks}));
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
                console.log(array)
                res.writeHead(200,{'Content-Type':'application/json'});
                res.end(JSON.stringify({message:"Task api called",data:array}));
            }
        }
        else{
            res.writeHead(200,{'Content-Type':'application/json'});
            res.end(JSON.stringify({message:"tasks is empty"}));
        }
    }

/*3>get a specific task by ID*/
    //GET /tasks/:id
    //     /tasks/5
    if(method==="GET" && pathname.length===3 && pathname[1]==="tasks"){
        const Id=+pathname[2];
        if(Id<=tasks.length){
            tasks.forEach((ele)=>{
                if(ele.id==pathname[2]){
                    res.writeHead(200,{'Content-Type':'application/json'});
                    res.end(JSON.stringify({message:"Task api called",data:ele}));
                }
            });
        }
        else{
            res.writeHead(404,{'Content-Type':'application/json'});
            res.end(JSON.stringify({message:"Task not found",data:{}}));
        }
    }
   

/*4>update the task*/
    //PUT /tasks/:id
    if(method==="PUT" && pathname.length===3 && pathname[1]==="tasks"){
        let data="";
        req.on("data",(chunk)=>{
            data+=chunk;
        })
        req.on("end",()=>{
            let ID=+pathname[2];
            let Data=JSON.parse(data);
            for (const element in Data) {
                (tasks[pathname[2]-1][element])=Data[element];
            }
            console.log(tasks);
            if(ID<=tasks.length){
                res.writeHead(200,{'Content-Type':'application/json'});
                res.end(JSON.stringify({message:"task updated",data:tasks[pathname[2]-1]}));
            }
            else{
                res.writeHead(404,{'Content-Type':'application/json'});
                res.end(JSON.stringify({message:"task updated"}));
            }
        })
    }

    
/*5>delete a task by id*/
    // DELETE /tasks/:id
    if(method==="DELETE" && pathname.length===3 && pathname[1]==="tasks"){
        const ID=+pathname[2];
         tasks.splice(pathname[2]-1,1);
         if(ID<=tasks.length){
            res.writeHead(200,{'Content-Type':'application/json'});
            res.end(JSON.stringify({message:"task deleted"}));
        }
        else{
            res.writeHead(404,{'Content-Type':'application/json'});
            res.end(JSON.stringify({message:"task deleted"}));
        }
    }

/*6>Task prioritization*/
    //PATCH /tasks/:id/priority
    if(method==="PATCH" && pathname.length===4 && pathname[1]==="tasks" && pathname[3]==="priority"){
        let body="";
        req.on("data",(chunk)=>{
            body=body+chunk
        })
        req.on("end",()=>{
            body=JSON.parse(body);
            tasks[pathname[2]-1].priority= body.priority; 
            res.writeHead(200,{'Content-Type':'application/json'});
            res.end(JSON.stringify({message:"priority updated",data:body}));
        })
    }

/*7>Assign task to user*/
    //PATCH /tasks/:id/assign
    if(method==="PATCH" && pathname.length===4 && pathname[1]==="tasks" && pathname[3]==="assign"){
            let body="";
            req.on("data",(chunk)=>{
                body=body+chunk
            })
            req.on("end",()=>{
                body=JSON.parse(body);
                tasks[pathname[2]-1].assignTo= body.assignTo; 
                res.writeHead(200,{'Content-Type':'application/json'});
                res.end(JSON.stringify({message:"priority updated",data:body}));
            })
    }

/*8>Unassign task */
   //PATCH /tasks/:id/unassign
   if(method==="PATCH" && pathname.length===4 && pathname[1]==="tasks" && pathname[3]==="unassign"){
        tasks[pathname[2]-1].assignTo=null;
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify({message:"priority updated",data: tasks[pathname[2]-1]}));
   }
  
})
server.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
});

