export class UserRepository{
    addUser(usersData,body){
        usersData.push(body);
        return body;
    }
    
    updateUser(usersData,body){
        usersData.forEach((para)=>{
            if(para.id==pathSegments[2]){
                for(let temp in body){
                    para[temp]=body[temp];
                }
            }
        })
        return body;
    }

    deleteUserById(usersData){
        usersData.forEach((para)=>{
            if(para.id==pathSegments[2]){
                usersData.splice(tasks.indexOf(para),1)
            }
        } ) 
    }
}