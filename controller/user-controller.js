import * as userService from '../services/user-service.js';
import { connectingDB } from '../config/database.js';

const getUser = async (req, res) => {
    try {
        await connectingDB();
    
        res.header('cache-control', 'no-cache');

        const email = req.username;
        console.log(`inside getUser controller endpoint ${email}`);
        if (req.headers['content-type'] || Object.keys(req.query).length > 0) {
            return res.status(400).send();
        }
        else{
            const user = await userService.findUserForGet(email)
            if(user){
                res.status(200).json(user)
            }
            else{
                res.status(400).json({message: "User not found"})
            }
        } 
    } catch (error) {
        console.error(error);
        return res.status(503).end();
    }

}

const updateUser = async (req, res) => {

    try{
        await connectingDB();
        const email = req.username;
        res.header('cache-control', 'no-cache');

        if(email !== req.body.email){
            return res.status(400).json();
        }

        const requiredFields = ['first_name', 'last_name', 'email', 'password'];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `${field} is required` });
            }
        }
    
        if (req.body.hasOwnProperty('uuid') || req.body.hasOwnProperty('account_created') || req.body.hasOwnProperty('account_updated') || 
        req.body.first_name === '' || req.body.last_name === '' || 
        req.body.email === '' || req.body.password === '' || 
        req.body.first_name === null || req.body.last_name === null || 
        req.body.email === null || req.body.password === null) {
            return res.status(400).json();
        }
        else{
            try {
                const user = await userService.searchUserToUpdate(email)
                
                user.set({...user.dataValues, ...req.body})
        
                await user.save();
                return res.status(204).json();
                
            } catch (error) {
                console.error('Error updating user:', error);
                return res.status(500).json();
            }
        }
    }catch(error){
        console.error(error);
        return res.status(503).end();
    }
}


const createUser = async (req, res) => {

    try{
        await connectingDB();
        res.header('cache-control', 'no-cache');
    
        const email = req.body.email
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
        return res.status(400).json()
        }
        else{
            if (req.body.hasOwnProperty('uuid') || req.body.hasOwnProperty('account_created') || req.body.hasOwnProperty('account_updated') || 
            !req.body.hasOwnProperty('first_name') || !req.body.hasOwnProperty('last_name') ||
            !req.body.hasOwnProperty('email') || !req.body.hasOwnProperty('password') ||
            req.body.first_name === '' || req.body.last_name === '' || 
            req.body.email === '' || req.body.password === '' || 
            req.body.first_name === null || req.body.last_name === null || 
            req.body.email === null || req.body.password === null) { 
                
                return res.status(400).json();
            }
            else{  
                const userExists = await userService.emailIdAlreadyRegistered(email)
        
                if(userExists){
                    res.status(400).send({
                        message: "Email is already Registered!"
                    })
                }
                else{
                    try{
                        const user = await userService.addUser(req.body);
                        return res.status(201).send(user)
                    } 
                    catch(err){
                        return res.status(400).json();
                    }
                }
            }
        
        }
    }catch(error){
        console.error(error);
        return res.status(503).end();
    }
}

const invalidURL = async (req, res) => {
    return res.status(405).end();
}

export {getUser, updateUser, createUser, invalidURL};
