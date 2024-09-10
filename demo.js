import { checkUserAuthentication, response, checkNotFound} from "./utility/authUtility";
import { tasks } from "./mockData/taskMockData";
import { decodeURL } from "./utility/utilityFunc";
import { TaskRepository} from "./repository/taskRepository"
let i=1,archive=[];
console
export class TasksController{
    controller(req,res){  
        const {queryPara,pathSegments,pathLength}=decodeURL(req.url);
        let method=req.method;
        let num=+pathSegments[2]; 
        let data="";
        req.on('data',(chunk)=>{
            data+=chunk;
            
        })

/*1>create a new task*/
    //post /tasks
    if(method==="POST" && pathLength===2){
        const token=checkUserAuthentication(req,res);
        if(token){
            req.on("end",()=>{
                const body=JSON.parse(data);
                
            })
        }
    }

/*2>get all task*/
    //GET /tasks
    else if(method==="GET" && pathLength===2){
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
   else if(method==="GET" && pathLength===3 && num>0){
    const token=checkUserAuthentication(req,res);
    if(token){
        try{
            let k=0;
                tasks.forEach((ele)=>{
                    if(ele.id==pathSegments[2]){
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
    else if(method==="PUT" && pathLength===3){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let k=0;
                req.on("end",()=>{
                    let body=JSON.parse(data);
                    tasks.forEach((para)=>{
                        if(para.id==pathSegments[2]){
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
    else if(method==="DELETE" && pathLength===3 && num>0){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let k=0;
                tasks.forEach((para)=>{
                    if(para.id==pathSegments[2]){
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
    else if(method==="PATCH" && pathLength===4 && pathSegments[3]==="priority"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let k=0;
                req.on("end",()=>{ 
                  let body=JSON.parse(data);
                    tasks.forEach((para)=>{
                        if(para.id==pathSegments[2]){
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
    else if(method==="PATCH" && pathLength===4 && pathSegments[3]==="assign"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let k=0;
                req.on("end",()=>{
                  let body=JSON.parse(data);
                    tasks.forEach((para)=>{
                        if(para.id==pathSegments[2]){
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
   else if(method==="PATCH" && pathLength===4 && pathSegments[3]==="unassign"){
    const token=checkUserAuthentication(req,res);
    if(token){
        try{
            let k=0;
            tasks.forEach((para)=>{
                if(para.id==pathSegments[2]){
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
    else if(method==="PATCH" && pathLength===4 && pathSegments[3]==="categorize"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let k=0;
                req.on("end",()=>{
                   let body=JSON.parse(data);
                    tasks.forEach((para)=>{
                        if(para.id==pathSegments[2]){
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
    else if(method==="GET" && pathLength===4 && pathSegments[3]==="history"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let k=0;
                tasks.forEach((para)=>{
                    if(para.id==pathSegments[2]){
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
    else if(method==="POST" && pathLength===4 && pathSegments[3]==="comments"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let k=0;
                req.on("end",()=>{
                   let body=JSON.parse(data);
                    tasks.forEach((para)=>{
                        if(para.id==pathSegments[2]){
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
    else if(method==="GET" && pathLength===3 && pathSegments[2]==="search"){
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
    else if(method==="PATCH" && pathLength===4 && pathSegments[3]==="complete"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let k=0;
                tasks.forEach((para)=>{
                    if(para.id==pathSegments[2]){
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
    else if(method==="PATCH" && pathLength===3 && pathSegments[2]==="complete-all"){
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
    else if(method==="DELETE" && pathLength===3 && pathSegments[2]==="delete-completed"){
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
    else if(method==="GET" && pathLength===3 && pathSegments[2]==="due-soon"){
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
    else if(method==="GET" && pathLength===3 && pathSegments[2]==="overdue"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let arr=[];
                tasks.forEach((para)=>{
                    if(para.status==="completed"){
                        let date1=new Date();
                        let date2=new Date(para.dueDate);
                        let diff=date2.getTime()-date1.getTime();
                        let dayDiff=Math.floor(diff/(1000*60*60*24));
                        if(dayDiff<0){
                            arr.push(para);
                        }
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
    else if(method==="POST" && pathLength===4 && pathSegments[3]==="duplicate"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let k=0,arr;
                tasks.forEach((para)=>{
                    if(para.id==pathSegments[2]){
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
    else if(method==="PATCH" && pathLength===4 && pathSegments[3]==="archive"){
        const token=checkUserAuthentication(req,res);
        if(token){
            try{
                let k=0;
                tasks.forEach((para)=>{
                    if(para.id==pathSegments[2] && para.status==="completed"){
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
    else if(method==="POST" && pathLength===4 && pathSegments[3]==="share"){
        let k=0;
    }

/*21>Bulk task creation*/
    //POST /tasks/bulk
    else if(method==="POST" && pathLength===3 && pathSegments[2]==="bulk"){
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
    }
}
//taskcontroller

import { checkUserAuthentication, response, checkNotFound} from "../utility/authUtility";
import { tasks } from "../mockData/taskMockData";
import { decodeURL } from "../utility/utilityFunc";
import { TaskService } from "../services/taskService";
let i=1,archive=[];

export class TasksController{
    constructor(){
        this.TaskService=new TaskService();
        }
     async controller(req,res){  
        const {queryPara,pathSegments,pathLength}=decodeURL(req.url);
        let method=req.method;
        let num=+pathSegments[2]; 
        let data="";
        req.on('data',(chunk)=>{
            data+=chunk;
        });

        if(method==="POST" && pathLength===2){
            const token=checkUserAuthentication(req,res);
            if(token){
                req.on("end",()=>{
                    const body=JSON.parse(data);
                    this.TaskService.addTask(body);
                })
            }
        }
    }
}

// /*2>get all task*/
//     //GET /tasks
//     else if(method==="GET" && pathLength===2){
//         const token=checkUserAuthentication(req,res);
//         if(token){
//         try{
//             let num=0,array=[];
//             if(tasks.length!=0){
//                 for(let abc in queryPara){
//                     num++;
//                 }
//                 if(num==0){
//                     response(tasks,"Task api called",200,res)
//                 }
//                 //logic for query parameter
//                 else{
//                     tasks.forEach((para)=>{
//                         for(let temp in para){
//                             if(para[temp]===queryPara[temp]){
//                                 array.push(para);
//                             }
//                         }
//                     })
//                     response(array,"Task api called",200,res)
//                 }
//             }
//             else{
//                 response("tasks is empty",404,res)
//             }
//         }
//         catch(err){
//             response("invalid token",401,res);
//         }
//     }
// }
// /*3>get a specific task by id*/
//     //GET /tasks/:id
//    else if(method==="GET" && pathLength===3 && num>0){
//     const token=checkUserAuthentication(req,res);
//     if(token){
//         try{
//             let k=0;
//                 tasks.forEach((ele)=>{
//                     if(ele.id==pathSegments[2]){
//                         k++;
//                         response(ele,"Task api called",200,res)
//                     }
//                 });
//                 checkNotFound(k,res);           
//             }
//             catch(err){
//                 response("invalid token",401,res);
//             }
//         }
//    }

    
// /*4>update the task*/
//     //PUT /tasks/:id
//     else if(method==="PUT" && pathLength===3){
//         const token=checkUserAuthentication(req,res);
//         if(token){
//             try{
//                 let k=0;
//                 req.on("end",()=>{
//                     let body=JSON.parse(data);
//                     tasks.forEach((para)=>{
//                         if(para.id==pathSegments[2]){
//                             for(let element in body){
//                             para[element]=body[element];
//                             }
//                             k++;
//                             response(para,"task updated",200,res);
//                         }
//                     })
//                     checkNotFound(k,res);           
//                 })
//             }
//             catch(err){
//                 response("invalid token",401,res);
//             }
//         }
//     }

    
// /*5>delete a task by id*/
//     // DELETE /tasks/:id
//     else if(method==="DELETE" && pathLength===3 && num>0){
//         const token=checkUserAuthentication(req,res);
//         if(token){
//             try{
//                 let k=0;
//                 tasks.forEach((para)=>{
//                     if(para.id==pathSegments[2]){
//                         tasks.splice(tasks.indexOf(para),1);
//                         k++;
//                         response("task deleted",200,res);
//                     }
//                 })
//                 checkNotFound(k,res);           
//             }
//             catch(err){
//                 response("invalid token",401,res);
//             }
//         }
//     }

// /*6>Task prioritization*/
//     //PATCH /tasks/:id/priority
//     else if(method==="PATCH" && pathLength===4 && pathSegments[3]==="priority"){
//         const token=checkUserAuthentication(req,res);
//         if(token){
//             try{
//                 let k=0;
//                 req.on("end",()=>{ 
//                   let body=JSON.parse(data);
//                     tasks.forEach((para)=>{
//                         if(para.id==pathSegments[2]){
//                             let status=para.priority;
//                             para.priority=body.priority;
//                             k++;
//                             para.history.push({timeStamp:`${new Date()}`,change:`priority is changed form ${status} to ${body.priority}`,changedBy:para.assignedTo})
//                             response(body,"priority updated",200,res);  
//                         }
//                     })
//                     checkNotFound(k,res);           
//                 })
//             } 
//             catch(err){
//                 response("invalid token",401,res);
//             }
//         }
//     }

// /*7>Assign task to user*/
//     //PATCH /tasks/:id/assign
//     else if(method==="PATCH" && pathLength===4 && pathSegments[3]==="assign"){
//         const token=checkUserAuthentication(req,res);
//         if(token){
//             try{
//                 let k=0;
//                 req.on("end",()=>{
//                   let body=JSON.parse(data);
//                     tasks.forEach((para)=>{
//                         if(para.id==pathSegments[2]){
//                             para.assignedTo= body.assignedTo; 
//                             k++;
//                             response(body,"task assigned",200,res);                 
//                         }
//                     })
//                     checkNotFound(k,res);           
//                 })
//             }
//             catch(err){
//                 response("invalid token",401,res);
//             }
//         }
//     }

// /*8>Unassign task */
//    //PATCH /tasks/:id/unassign
//    else if(method==="PATCH" && pathLength===4 && pathSegments[3]==="unassign"){
//     const token=checkUserAuthentication(req,res);
//     if(token){
//         try{
//             let k=0;
//             tasks.forEach((para)=>{
//                 if(para.id==pathSegments[2]){
//                     para.assignedTo=null;
//                     k++;
//                     response(para,"task unassigned",200,res);                 
//                 }
//             })
//             checkNotFound(k,res);           
//            }
//            catch(err){
//             response("invalid token",401,res);
//         }
//     }
// }

// /*9>categorize tasks*/ 
//     //PATCH /tasks/:id/categorize
//     else if(method==="PATCH" && pathLength===4 && pathSegments[3]==="categorize"){
//         const token=checkUserAuthentication(req,res);
//         if(token){
//             try{
//                 let k=0;
//                 req.on("end",()=>{
//                    let body=JSON.parse(data);
//                     tasks.forEach((para)=>{
//                         if(para.id==pathSegments[2]){
//                             k++;
//                             para.category= body.category; 
//                             response(body,"task categorized",200,res);                 
//                         }
//                     })    
//                     checkNotFound(k,res);           
//                 })
//         }
//         catch(err){
//             response("invalid token",401,res);
//         }
//     }
// }

// /*10>history*/
//     //GET /tasks/:id/history
//     else if(method==="GET" && pathLength===4 && pathSegments[3]==="history"){
//         const token=checkUserAuthentication(req,res);
//         if(token){
//             try{
//                 let k=0;
//                 tasks.forEach((para)=>{
//                     if(para.id==pathSegments[2]){
//                         k++;
//                         response(para.history,"task history",200,res);                 
//                     }
//                 })
//                 checkNotFound(k,res);           
//             }
//             catch(err){
//                 response("invalid token",401,res);
//             }
//         }
// }


// /*11>Task commenting*/
//     //POST /tasks/:id/comments
//     else if(method==="POST" && pathLength===4 && pathSegments[3]==="comments"){
//         const token=checkUserAuthentication(req,res);
//         if(token){
//             try{
//                 let k=0;
//                 req.on("end",()=>{
//                    let body=JSON.parse(data);
//                     tasks.forEach((para)=>{
//                         if(para.id==pathSegments[2]){
//                             para.comments=body
//                             k++;
//                             response(body,"comment created",201,res);                 
//                         }
//                     })
//                     checkNotFound(k,res);           
//                 })  
//             }
//             catch(err){
//                 response("invalid token",401,res);
//             }
//         }
// }

// /*12>search tasks*/
//     //GET /tasks/search
//     else if(method==="GET" && pathLength===3 && pathSegments[2]==="search"){
//         const token=checkUserAuthentication(req,res);
//         if(token){
//             try{
//                 let arr=[];
//                 tasks.forEach((para)=>{
//                     if(para.title==queryPara.q || para.description==queryPara.q){
//                         arr.push(para)
//                     }       
//                 })
//                 response(arr,"task searched",200,res);                 
//             }
//             catch(err){
//                 response("invalid token",401,res);
//             }
//         }
//     }
// /*13>Task completion*/
//     //PATCH /tasks/:id/complete
//     else if(method==="PATCH" && pathLength===4 && pathSegments[3]==="complete"){
//         const token=checkUserAuthentication(req,res);
//         if(token){
//             try{
//                 let k=0;
//                 tasks.forEach((para)=>{
//                     if(para.id==pathSegments[2]){
//                         k++;
//                         let status=para.status;
//                         para.status="completed";
//                         response(para,"task completed",200,res);      
//                         para.history.push({timeStamp:new Date(),change:`status changed form ${status} to ${para.status}`})           
//                     }
//                 })
//                 checkNotFound(k,res);           
//             }
//             catch(err){
//                 response("invalid token",401,res);
//             }
//         }
// }

// /*14>complete all pending tasks*/
//     //PATCH /tasks/complete-all
//     else if(method==="PATCH" && pathLength===3 && pathSegments[2]==="complete-all"){
//         const token=checkUserAuthentication(req,res);
//         if(token){
//             try{
//                 let arr=[];
//                 tasks.forEach((para)=>{
//                     if(para.status!="completed"){
//                         para.status="completed";
//                         arr.push(para);
//                     }
//                 })
//                 response(arr,"all task completed",200,res);                 
//             }
//             catch(err){
//                 response("invalid token",401,res);
//             }
//         }
// }
    
// /*15>Delete all completed tasks*/
//     //DELETE /tasks/delete-completed
//     else if(method==="DELETE" && pathLength===3 && pathSegments[2]==="delete-completed"){
//         const token=checkUserAuthentication(req,res);
//         if(token){
//             try{
//                 let count=0,j=0;
//                 tasks.forEach((para)=>{
//                     if(para.status==="completed"){
//                             j++;
//                 }})
//                 recursive();
//                 function recursive(){
//                     tasks.forEach((para)=>{
//                         if(para.status==="completed"){
//                             tasks.splice(tasks.indexOf(para),1);
//                             count++
//                         }
//                     })
//                     if(j!=0){
//                         j--;
//                         recursive();
//                     }
//                 } 
//                 response(`deleted count=${count}`,"all completed tasks deleted",200,res);                 
//             }
//             catch(err){
//                 response("invalid token",401,res);
//             }
//         }
// }

// /*16>due date remainder*/
//     //GET /tasks/due-soon
//     else if(method==="GET" && pathLength===3 && pathSegments[2]==="due-soon"){
//         const token=checkUserAuthentication(req,res);
//         if(token){
//             try{
//                 let arr=[];
//                 tasks.forEach((para)=>{
//                     let date1=new Date();
//                     let date2=new Date(para.dueDate);
//                     let diff=date2.getTime()-date1.getTime();
//                     let dayDiff=Math.floor(diff/(1000*60*60*24));
//                     if(dayDiff<=7 && dayDiff>=0){
//                         arr.push(para);
//                     }
//                 })
//                 response(arr,"due soon tasks",200,res);                 
//             }
//             catch(err){
//                 response("invalid token",401,res);
//             }
//         }
// }

// /*17>overdue tasks*/
//     //GET /tasks/overdue
//     else if(method==="GET" && pathLength===3 && pathSegments[2]==="overdue"){
//         const token=checkUserAuthentication(req,res);
//         if(token){
//             try{
//                 let arr=[];
//                 tasks.forEach((para)=>{
//                     if(para.status==="completed"){
//                         let date1=new Date();
//                         let date2=new Date(para.dueDate);
//                         let diff=date2.getTime()-date1.getTime();
//                         let dayDiff=Math.floor(diff/(1000*60*60*24));
//                         if(dayDiff<0){
//                             arr.push(para);
//                         }
//                     }
//                 })
//                 response(arr,"overdue tasks",200,res);                 
//             }
//             catch(err){
//                 response("invalid token",401,res);
//             }
//         }
// }

// /*18>Task duplication*/
//     //POST /tasks/:id/duplicate
//     else if(method==="POST" && pathLength===4 && pathSegments[3]==="duplicate"){
//         const token=checkUserAuthentication(req,res);
//         if(token){
//             try{
//                 let k=0,arr;
//                 tasks.forEach((para)=>{
//                     if(para.id==pathSegments[2]){
//                         k++;
//                         arr={...para}
//                         arr.id=i++;
//                         tasks.push(arr);
//                         console.log(i);
//                         response(para,"duplicate completed",200,res);                 
//                     }
//                 })
//                 // checkNotFound(k,res);                           
//             }
//             catch(err){
//                 response("invalid token",401,res);
//             }
//         }
// }

// /*19>Archive completed tasks*/
//     //PATCH /tasks/id/archive
//     else if(method==="PATCH" && pathLength===4 && pathSegments[3]==="archive"){
//         const token=checkUserAuthentication(req,res);
//         if(token){
//             try{
//                 let k=0;
//                 tasks.forEach((para)=>{
//                     if(para.id==pathSegments[2] && para.status==="completed"){
//                         archive.push(para);
//                         archive.archive=true;
//                         tasks.splice(tasks.indexOf(para),1);
//                         k++;
//                         response(archive,"task archived",200,res);            
//                     }
//                 })
//                 checkNotFound(k,res);           
//             }
//             catch(err){
//                 response("invalid token",401,res);
//             }
//         }
// }

// /*20>task sharing*/
//     //POST /tasks/:id/share
//     else if(method==="POST" && pathLength===4 && pathSegments[3]==="share"){
//         let k=0;
//     }

// /*21>Bulk task creation*/
//     //POST /tasks/bulk
//     else if(method==="POST" && pathLength===3 && pathSegments[2]==="bulk"){
//         const token=checkUserAuthentication(req,res);
//         if(token){
//             try{
//                 let arr=[];
//                 req.on("end",()=>{
//                     let body=JSON.parse(data);
//                     body.forEach((para)=>{
//                         para.id=i++;
//                         tasks.push(para);
//                         arr.push(para)
//                     })
//                     response(arr,"bulk task created",200,res);                 
//                 })
//             }
//             catch(err){
//                 response("invalid token",401,res);
//             }
//         }
// }
//     }
// }


// TaskService/
// import { TaskRepository } from "../repository/taskRepository";
// let i=0;
// export class TaskService{
//     constructor(){
//         this.taskRepository=new TaskRepository();
//     }
//     async addTask(task){
//             task.id=i++;
//             task.history=[];
//             task.archive=false;
//             await this.taskRepository.addTask(task);
//             return task;
//     }
//     // async deleteTask(id){
        
//     // }
//     // async updateTask(body){

// //     // }
// // }

// task repo
// import { tasks } from "../mockData/taskMockData";

// export class TaskRepository{
//     async addTask(task){
//         tasks.push(task)
//     }
//     // async deleteTaskById(id){

//     // }
//     // async updateTask(body){
//     //     tasks.forEach((para)=>{
//     //         if(para.id==pathSegments[2]){
//     //             for(let element in body){
//     //             para[element]=body[element];
//     //             }
//     //         }
//     //     })
//     // }
// }