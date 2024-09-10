import { checkUserAuthentication, response, checkNotFound} from "../utility/authUtility";
import { tasks } from "../mockData/taskMockData";
import { decodeURL } from "../utility/utilityFunc";
import { TaskService } from "../services/taskService";

export class TasksController{
    constructor(){
        this.TaskService=new TaskService();
        }
        controller(req,res){  
            const {queryPara,pathSegments,pathLength}=decodeURL(req.url);
            let method=req.method;
            let num=+pathSegments[2]; 
            let data="";
            req.on('data',(chunk)=>{
                data+=chunk;
            });

/*1>create task*/
    //POST /tasks
            if(method==="POST" && pathLength===2){
                const token=checkUserAuthentication(req,res);
                if(token){
                    req.on("end",()=>{
                        const body=JSON.parse(data);
                        const task=this.TaskService.addTask(body);
                        response(task,"Task added successfully",201,res);
                        return;
                    })
                }
            } 

/*2>get all task*/
    //GET /tasks
    else if(method==="GET" && pathLength===2){
        const token=checkUserAuthentication(req,res);
        if(token){
            const task=this.TaskService.getAllTask(tasks,queryPara);
            response(task,"Task api called",200,res)                
            }
        }   

/*3>get a specific task by id*/
    //GET /tasks/:id
   else if(method==="GET" && pathLength===3 && num>0){
    const token=checkUserAuthentication(req,res);
    if(token){
            // const task=this.TaskService.getTaskById(tasks,pathSegments[2]);
            const task=this.TaskService.getTaskById(tasks,pathSegments);
            console.log(task);
                    response(task,"Task api called",200,res)                
        }     
    }
    
/*4>update the task*/
    //PUT /tasks/:id
    else if(method==="PUT" && pathLength===3){
        const token=checkUserAuthentication(req,res);
        if(token){
                req.on("end",()=>{
                    let body=JSON.parse(data);
                    const task=this.TaskService.updateTask(body,tasks,pathSegments);
                    console.log("final=",task);
                    response(task,"task updated",200,res);     
                })
        }
    }

/*5>delete a task by id*/
    // DELETE /tasks/:id
    else if(method==="DELETE" && pathLength===3 && num>0){
        const token=checkUserAuthentication(req,res);
        if(token){

                tasks.forEach((para)=>{
                    if(para.id==pathSegments[2]){
                        this.TaskService.deleteTaskById(tasks,para);
                        response("task deleted",200,res);
                    }
                }           
        )}
    }

/*6>Task prioritization*/
    //PATCH /tasks/:id/priority
    else if(method==="PATCH" && pathLength===4 && pathSegments[3]==="priority"){
        const token=checkUserAuthentication(req,res);
        if(token){
                req.on("end",()=>{ 
                  let body=JSON.parse(data);
                  const task= this.TaskService.taskPriority(tasks,body,pathSegments);
                  response(task,"priority updated",200,res);          
                })
            } 
        }

/*7>Assign task to user*/
    //PATCH /tasks/:id/assign
    else if(method==="PATCH" && pathLength===4 && pathSegments[3]==="assign"){
        const token=checkUserAuthentication(req,res);
        if(token){
                req.on("end",()=>{
                  let body=JSON.parse(data);
                  const task=this.TaskService.assignTask(tasks,body,pathSegments);
                  response(task,"task assigned",200,res);                            
                })
        }
    }

/*8>Unassign task */
   //PATCH /tasks/:id/unassign
   else if(method==="PATCH" && pathLength===4 && pathSegments[3]==="unassign"){
    const token=checkUserAuthentication(req,res);
    if(token){
        let task=this.TaskService.unassignTask(tasks,pathSegments);
        response(task,"task unassigned",200,res);                 
           
}
   }

/*9>categorize tasks*/ 
    //PATCH /tasks/:id/categorize
    else if(method==="PATCH" && pathLength===4 && pathSegments[3]==="categorize"){
        console.log("hi");
        const token=checkUserAuthentication(req,res);
        if(token){
                req.on("end",()=>{
                   let body=JSON.parse(data);
                    const task=this.TaskService.categorizeTask(tasks,pathSegments,body);
                    response(task,"task categorized",200,res);                               
                })
        }
}

/*10>history*/
    //GET /tasks/:id/history
    else if(method==="GET" && pathLength===4 && pathSegments[3]==="history"){
        const token=checkUserAuthentication(req,res);
        if(token){
            let final=this.TaskService.taskHistoryTracking(tasks,pathSegments); 
            response(final.history,"task history",200,res);                 
        }           
    }


/*11>Task commenting*/
    //POST /tasks/:id/comments
    else if(method==="POST" && pathLength===4 && pathSegments[3]==="comments"){
        const token=checkUserAuthentication(req,res);
        if(token){
                req.on("end",()=>{
                   let body=JSON.parse(data);
                    const task=this.TaskService.taskCommenting(tasks,pathSegments,body); 
                    response(task,"comment created",201,res);                           
                })  
        }
}

/*12>search tasks*/
    //GET /tasks/search
    else if(method==="GET" && pathLength===3 && pathSegments[2]==="search"){
        const token=checkUserAuthentication(req,res);
        if(token){
                let arr=[];
                let task=this.TaskService.searchTask(tasks,queryPara,arr); 
                response(task,"task searched",200,res);                              
        }
    }
/*13>Task completion*/
    //PATCH /tasks/:id/complete
    else if(method==="PATCH" && pathLength===4 && pathSegments[3]==="complete"){
        const token=checkUserAuthentication(req,res);
        if(token){
            let task=this.TaskService.taskCompletion(tasks,pathSegments); 
            response(task,"task completed",200,res);      
            }           
}

/*14>complete all pending tasks*/
    //PATCH /tasks/complete-all
    else if(method==="PATCH" && pathLength===3 && pathSegments[2]==="complete-all"){
        const token=checkUserAuthentication(req,res);
        if(token){
            let arr=[];
            let final=this.TaskService.completeAll(tasks,arr); 
            response(final,"all task completed",200,res);                 
        }
}
    

/*15>Delete all completed tasks*/
    //DELETE /tasks/delete-completed
    else if(method==="DELETE" && pathLength===3 && pathSegments[2]==="delete-completed"){
        const token=checkUserAuthentication(req,res);
        if(token){
            let final=this.TaskService.deleteAllCompleted(tasks); 
            response(`deleted count=${final}`,"all completed tasks deleted",200,res);                 
        }
}

/*16>due date remainder*/
    //GET /tasks/due-soon
    else if(method==="GET" && pathLength===3 && pathSegments[2]==="due-soon"){
        const token=checkUserAuthentication(req,res);
        if(token){
            let arr=[];
            let final=this.TaskService.dueDateRemainder(tasks,arr); 
            response(final,"due soon tasks",200,res);                 
        }
}

/*17>overdue tasks*/
    //GET /tasks/overdue
    else if(method==="GET" && pathLength===3 && pathSegments[2]==="overdue"){
        const token=checkUserAuthentication(req,res);
        if(token){
            let arr=[];
            let final=this.TaskService.overdue(tasks,arr); 
            response(final,"overdue tasks",200,res);                 
        }
}

/*18>Task duplication*/
    //POST /tasks/:id/duplicate
    else if(method==="POST" && pathLength===4 && pathSegments[3]==="duplicate"){
        const token=checkUserAuthentication(req,res);
        if(token){
            let arr=[];
            let final=this.TaskService.taskDuplication(tasks,arr); 
            response(final,"duplicate completed",200,res);                   
                }
}

/*19>Archive completed tasks*/
    //PATCH /tasks/id/archive
    else if(method==="PATCH" && pathLength===4 && pathSegments[3]==="archive"){
        const token=checkUserAuthentication(req,res);
        if(token){
            let final=this.TaskService.archiveCompletedTask(tasks,archive); 
            response(final,"task archived",200,res);                     
        }
}

/*21>Bulk task creation*/
    //POST /tasks/bulk
    else if(method==="POST" && pathLength===3 && pathSegments[2]==="bulk"){
        const token=checkUserAuthentication(req,res);
        if(token){
                req.on("end",()=>{
                    let arr=[];
                    let body=JSON.parse(data);
                    let final=this.TaskService.bulkTAskCreation(tasks,body,arr); 
                    response(final,"bulk task created",200,res);                 
                })
        }
}
    }
}
