import userService from "../services/user.service.js";
import { generateToken } from "../utils/jwt.utils.js";

const authController = {
    register : async (req,res)=>{
        const newUser = await userService.create(req.data);
        
        res.status(204).send();
    },
    login: async (req,res)=>{
        const user = await userService.login(req.data);
        
        const token = generateToken(user);

        res.status(200).json({token});
    }
}

export default authController