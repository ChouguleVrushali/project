import { UserRepository } from "../repository/userRepository";
export class UserService{
    constructor(){
        this.UserRepository=new UserRepository();
    }
     addUser(usersData,body){
        return this.UserRepository.addUser(usersData,body);
    }
    updateUser(usersData,body){
        return this.UserRepository.updateUser(usersData,body);
    }
    
    deleteUserById(usersData){
       this.UserRepository.deleteUserById(usersData,body); 
    }
}