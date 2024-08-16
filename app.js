import http from "http";
import url from "url";
const PORT=3000;

let i=1;
let tasks=[];

const server=http.createServer((req,res)=>{
    const path=url.parse(req.url,true);
    const method=req.method;
    const queryPara=path.query;
    console.log(queryPara)
    const pathname=path.pathname.split("/");
    
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
            console.log("tasks=",tasks);
            res.writeHead(201,{'Content-Type':'application/json'});
            res.end(JSON.stringify({message:"Task added",data:Data}));
        });
    }

    // { status: 'completed', priority: 'high' }

/*2>get all task*/
    //GET /tasks
    if(method==="GET" && pathname.length===2 && pathname[1]==="tasks"){
        if(tasks.length!=0){
            // tasks.forEach((para)=>{
            //     for(let temp in para){
            //         if(para[temp]===queryPara[temp]){
            //             console.log(para);
            //         }
            //     }
            // })
            res.writeHead(200,{'Content-Type':'application/json'});
            res.end(JSON.stringify({message:"Task api called",data:{tasks}}));
        }
        else{
            res.writeHead(200,{'Content-Type':'application/json'});
            res.end(JSON.stringify({message:"tasks is empty",data:{}}));
        }
    }

/*3>get a specific task by ID*/
    //GET /tasks/:id
    //     /tasks/5
    if(method==="GET" && pathname.length===3 && pathname[1]==="tasks"){
        const Id=+pathname[2];
        if(Id<=tasks.length){
            res.writeHead(200,{'Content-Type':'application/json'});
            res.end(JSON.stringify({message:"Task api called",data:tasks[Id-1]}));
        }
        else{
            res.writeHead(404,{'Content-Type':'application/json'});
            res.end(JSON.stringify({message:"Task not found",data:{}}));
        }
    }

    // {
    //     title:"task1",
    //     status:"complete",
    //     priority:"high"
    // }

    // {
    //     title:"task title",
    //     description:"task description",
    //     deuDate:"20/08/2024",
    //     status:"pending",
    //     priority:"medium"
    // }

/*4>update the task*/
    //PUT /tasks/:id
    if(method==="PUT" && pathname.length===3 && pathname[1]==="tasks"){
        let data="";
        req.on("data",(chunk)=>{
            data+=chunk;
            console.log(data);
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
        })
    }

// /*5>delete a task by id*/
    //DELETE /tasks/:id
//     if(method==="DELETE" && pathname.length===3 && pathname[1]==="tasks"){
        
//     }
    
})
server.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
});



