import { tasks } from "../mockData/taskMockData";
export class TaskRepository{
     addTask(task){
        tasks.push(task)
    }

    getAllTask(tasks,num,queryPara){
        let array=[];
        if(num==0){
            return tasks;
        }
        else{
            tasks.forEach((para)=>{
                for(let temp in para){
                    if(para[temp]===queryPara[temp]){
                        array.push(para);
                    }
                }
            })
            return array;
        }
    }

    getTaskById(a,b){
        return a.find(task=>task.id==b[2]);
    }

    
    updateTask(body,para){
        for(let element in body){
            para[element]=body[element];
        }
        return para;
    }
    
    deleteTaskById(tasks,para){
        tasks.splice(tasks.indexOf(para),1)
    }
    
    taskPriority(para,body){
        let status=para.priority;
        para.priority=body.priority;
        para.history.push({timeStamp:`${new Date()}`,change:`priority is changed form ${status} to ${body.priority}`,changedBy:para.assignedTo})
        return para;
    }

    assignTask(para,body){
        para.assignedTo= body.assignedTo; 
        return para;
    }

    unassignTask(para){
        para.assignedTo=null;
        return para;
    }

    categorizeTask(para,body){
        para.category= body.category; 
        return para;
    }

    taskHistoryTracking(para){
        return para;
    }

    taskCommenting(para,body){
        para.comments=body;
        return para;;
    }

    searchTask(tasks,queryPara,arr){
       tasks.forEach((para)=>{
            if(para.title==queryPara.q || para.description==queryPara.q){
                arr.push(para)
            }       
        })
        return arr;
    }

    taskCompletion(para){
        let status=para.status;
        para.status="completed";
        para.history.push({timeStamp:new Date(),change:`status changed form ${status} to ${para.status}`}) 
        return para;          
    }

    completeAll(tasks,arr){
         tasks.forEach((para)=>{
            if(para.status!="completed"){
                para.status="completed";
                arr.push(para);
            }
        })
        return arr;
    }

    deleteAllCompleted(tasks,count,j){
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
            else{
                console.log(count);
                return count;
            }
        } 
    }

    dueDateRemainder(para,arr){
        arr.push(para);
        return arr;
    }

    overdue(para,arr){
        arr.push(para);
        return arr;
    }

    taskDuplication(tasks,arr){
        tasks.forEach((para)=>{
            if(para.id==pathSegments[2])
                arr={...para}
                arr.id=i++;
                tasks.push(arr);
                console.log(i);
        })        
            return para;
    }

    archiveCompletedTask(para,archive){
        archive.push(para);
        archive.archive=true;
        tasks.splice(tasks.indexOf(para),1)
        return archive;
    }

    bulkTAskCreation(tasks,arr,body){
        body.forEach((para)=>{
            para.id=i++;
            tasks.push(para);
            arr.push(para)
        });
        return arr;
    }
}