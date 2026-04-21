import { sendTemplatedEmail } from "../services/mail.service.js";
import userService from "../services/user.service.js";
import { generateToken } from "../utils/jwt.utils.js";

const authController = {
register : async (req, res) => {
        // Crée l'utilisateur
        const newUser = await userService.create(req.data);
        
        // 2. Ajoute la logique d'envoi d'email ici
        let emailSent = false;
        try {
            await sendTemplatedEmail(
                newUser.email,
                "Welcome to Checkmate!",
                "welcome", // cherche templates/welcome.hbs
                {
                    username: newUser.username,
                    loginUrl: process.env.APP_URL || "http://localhost:3000/auth/login", 
                },
            );
            emailSent = true;
        } catch (error) {
            console.error("Error sending welcome email:", error);
            // On ne bloque pas l'inscription si le mail échoue, 
            // mais on le log pour le debug.
        }

        // 3. Renvoie une réponse plus complète (201 au lieu de 204 pour inclure le JSON)
        res.status(201).json({
            message: "User registered successfully",
            emailSent,
            userId: newUser.id
        });
    },
    login: async (req,res)=>{
        const user = await userService.login(req.data);
        
        const token = generateToken(user);

        res.status(200).json({token});
    }
}

export default authController