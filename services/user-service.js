import User from '../model/user.js';
import bcrypt from 'bcrypt';
import { statsdClient } from '../services/statD.js'

const createPasswordHash = async (password) => {
    const saltRounds = 10;  // You can adjust the salt rounds based on your security needs
    return await bcrypt.hash(password, saltRounds);
};


const searchByEmailId = async (email) => {
    try{
        if (!email) {
            throw new Error("Email is not provided");
        }
        try {
            const startSearchEmail = Date.now();
            const user = await User.findAll({
                where: {
                    email,
                },
                attributes: {
                    exclude: ["password"],
                },
            });

            const duration = Date.now() - startSearchEmail;
            statsdClient.timing('db.query.find_user_by_email.duration', duration);
            return user;
        } catch (error) {
            console.error('Error occurred while fetching user:', error);
            return [];
        }
    }catch(error){
        console.error("Error occurred while fetching user: ", error);
        // throw error; 
    }
}
  
const findUserForGet = async(email) => {
    try{
        if (!email) {
            throw new Error("Email is not provided");
        }
        try {
            const startForGetUser = Date.now();
            const user = await User.findOne({
                where: {
                    email,
                },
                attributes: {
                    exclude: ["password"],
                },
            });
            
            const duration = Date.now() - startForGetUser;
            statsdClient.timing('db.query.get_user_data.duration', duration);
            return user;
        } catch (error) {
            console.error('Error occurred while fetching user:', error);
        }
    }catch(error){
        console.error("Error occurred while fetching user:", error);
        // throw error; 
    }
}
  
const searchUserToUpdate = async (email) => {
    try{    
        if (!email) {
            throw new Error("Email is not provided");
        }
        try {
            const startForUpdateUser = Date.now();
            const user = await User.findOne({
                where: {
                    email,
                },
                attributes: {
                    exclude: ["password"],
                },
            });
            
            const duration = Date.now() - startForUpdateUser;
            statsdClient.timing('db.query.update_user_data.duration', duration);
            
            return user;
        } catch (error) {
            console.error('Error occurred while fetching user:', error);
        }
    }catch(error){
            console.error("Error occurred while fetching user:", error);
            // throw error; 
    }
} 
  
const addUser = async (payload) => {
  
    try {
    
      const startForAddUser = Date.now();
      const user = await User.create(payload, {
        attributes: ['uuid', 'first_name', 'last_Name', 'email', 'account_created', 'account_updated', 'verified', 'verificationToken', 'tokenExpiry'], 
      });
      
      const duration = Date.now() - startForAddUser;
      statsdClient.timing('db.query.Add_new_user_data.duration', duration);

      const userResponse = user.toJSON();
      delete userResponse.password;
    
      return userResponse;
    } catch (error) {
      console.error('Error occurred while creating user:', error);
    }
    
}


const emailIdAlreadyRegistered = async (email) => {
    try {
        const users = await searchByEmailId(email);
    
        return users.length > 0;
      } catch (error) {

        console.error('Error checking users:', error);
        return false; 
      }
}

export {searchByEmailId, findUserForGet, searchUserToUpdate, addUser, emailIdAlreadyRegistered, createPasswordHash} ;