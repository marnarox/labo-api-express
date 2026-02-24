import jwt from "jsonwebtoken";

const {JWT_SECRET} = process.env;

/**
 * Génère un nouveau token JWT pour un utilisateur donné.
 * @param {Object} user - L'objet utilisateur issu de la base de données
 */
export const generateToken = (user) =>{

    const payload = {
        id: user.id,
        role: user.role
    }
      const token = jwt.sign(payload, JWT_SECRET, {
    // Définit la durée de validité du token (ici 2 heures : 60s * 60m * 2)
    expiresIn: 60 * 60 * 2,
  });

  return token;

};

/**
 * Vérifie l'authenticité d'un token et extrait les données (payload) qu'il contient.
 * @param {string} token - Le token envoyé par le client
 */
export const decodeToken = (token) => {
  // Vérifie la signature avec la clé secrète.
  // Si le token est expiré ou falsifié, cette fonction lève une erreur.
  return jwt.verify(token, JWT_SECRET);
};