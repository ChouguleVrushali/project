import { TaskRepository } from "../repository/taskRepository";

let i=1;
export class TaskService{
    constructor(){
        this.taskRepository=new TaskRepository();
    }
    addTask(task){
        // console.log("in service");
        task.id=i++;
        task.history=[];
        task.archive=false;
        this.taskRepository.addTask(task);
            return task;
    }

    getAllTask(tasks,queryPara){
        let num=0;
        if(tasks.length!=0){
            for(let abc in queryPara){
                num++;
            }
              return this.taskRepository.getAllTask(tasks,num,queryPara);
        }
    }
    getTaskById(a,b){
              return this.taskRepository.getTaskById(a,b);
                     
    }
    updateTask(body,tasks,pathSegments){
        let final=tasks.find(para=>para.id==pathSegments[2]);
        if(final){
            console.log(final);
            return this.taskRepository.updateTask(body,final)
        }
    }
    
    deleteTaskById(tasks,para){
        this.taskRepository.deleteTaskById(tasks,para);

    }

    taskPriority(tasks,body,pathSegments){
        let final=tasks.find(para=>para.id==pathSegments[2]);
        if(final){
            return this.taskRepository.taskPriority(final,body);
        }
    }
    assignTask(tasks,body,pathSegments){
        let final=tasks.find((para)=>para.id==pathSegments[2]);
        if(final){
            return this.taskRepository.assignTask(final,body);
        }
    }

    unassignTask(tasks,pathSegments){
       let final=tasks.find((para)=>para.id==pathSegments[2]);
        if(final){
            return this.taskRepository.unassignTask(final);
        }
    }

    categorizeTask(tasks,pathSegments,body){
        let final=tasks.find((para)=>para.id==pathSegments[2]);
        console.log(final);
        if(final){
            return this.taskRepository.categorizeTask(final,body);
        }
    }

    taskHistoryTracking(tasks,pathSegments){
        // tasks.forEach((para)=>{
        //     if(para.id==pathSegments[2])
        //         return this.taskRepository.taskHistoryTracking(para);
        //     }) 
        let final=tasks.find((para)=>para.id==pathSegments[2]);
        if(final){
            return this.taskRepository.taskHistoryTracking(final);
        }
    }

    taskCommenting(tasks,pathSegments,body){
        let final=tasks.find((para)=>para.id==pathSegments[2]);
        if(final){
            return this.taskRepository.taskCommenting(final,body);
        }
    }

    searchTask(tasks,queryPara,arr){
            return this.taskRepository.searchTask(tasks,queryPara,arr);
    }

    taskCompletion(tasks,pathSegments){
        let final=tasks.find((para)=>para.id==pathSegments[2]);
        if(final){
            return this.taskRepository.taskCompletion(final);
        }
    }

    completeAll(tasks,arr){
        return this.taskRepository.taskCompletion(tasks,arr);
    }

    deleteAllCompleted(tasks){
        let count=0,j=0;
        tasks.forEach((para)=>{
            if(para.status==="completed"){
                    j++;
                    console.log("j=",j);
                }})
            return this.taskRepository.deleteAllCompleted(tasks,count,j);
    }

    dueDateRemainder(tasks,arr){
        tasks.forEach((para)=>{
            let date1=new Date();
            let date2=new Date(para.dueDate);
            let diff=date2.getTime()-date1.getTime();
            let dayDiff=Math.floor(diff/(1000*60*60*24));
            if(dayDiff<=7 && dayDiff>=0){
                return this.taskRepository.dueDateRemainder(para,arr);
            }
        })
    }

    overdue(tasks,arr){
        tasks.forEach((para)=>{
            if(para.status==="completed"){
                let date1=new Date();
                let date2=new Date(para.dueDate);
                let diff=date2.getTime()-date1.getTime();
                let dayDiff=Math.floor(diff/(1000*60*60*24));
                if(dayDiff<0){
                    return this.taskRepository.overdue(para,arr);
                }
            }
        })
    }

    taskDuplication(tasks,arr){
        return this.taskRepository.taskDuplication(tasks,arr);     
    }

    archiveCompletedTask(tasks,archive){
        let final=tasks.find(para=>para.id==pathSegments[2] && para.status=="completed");
        if(final){
            return this.taskRepository.archiveCompletedTask(final,archive);
        }
    }

    bulkTAskCreation(tasks,body,arr){
        return this.taskRepository.bulkTAskCreation(tasks,arr,body);
    }
 }