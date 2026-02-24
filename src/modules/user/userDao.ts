import { User } from "./userModel";
import { IUser } from "./userInterface";

export class UserDao{

    static async create(data:IUser){
        return  User.create(data)
    }
}
