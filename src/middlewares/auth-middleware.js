import { decode } from 'jsonwebtoken';
import { decodeToken } from '../utils/jwt.utils.js';

/**
 * Middleware d'authentificatioon globale
 * il a pour rôle d'extraire le toeken et d'identifier l'utilisateur S'IL est présent
 */

export const authentification = (req, res, next) => {
	const bearerToken = req.headers['authorization'];

	if (bearerToken) {
		const [bearer, token] = bearerToken.split(' ');

		if (bearer.toLowerCase() !== 'bearer') {
			res.status(403).send();
			return;
		}
		try {
			// Tentative de décodage et vérification de la signature du token
			const decoded = decodeToken(token);

			// Sauvegarde les infos de l'utilisateur directement dans l'objet "req"
			// Cela permet aux routes suivantes d'accéder à req.user.id ou req.user.role
			req.user = {
				id: decoded.id,
				role: decoded.role,
			};
		} catch (err) {
			// Si le token est expiré ou invalide, on renvoie une erreur 401 (Non autorisé)
			res.status(401).send();
			return;
		}
	}
    next();
};

export const connected = (onlyForAdmin) => {
  return (req, res, next) => {
    // Si l'utilisateur n'est pas identifié (pas de req.user), accès refusé
    if (!req.user) {
      res.status(401).send();
      return;
    }

    // Si une liste de rôles spécifiques est fournie pour cette route
    if (onlyForAdmin) {
      const userRole = req.user.role;

      // Vérifie si le rôle de l'utilisateur est inclus dans la liste autorisée
      if (!onlyForAdmin.includes(userRole)) {
        res.status(403).send(); // 403 Forbidden : identifié mais pas les droits
        return;
      }
    }

    // L'utilisateur est connecté et a le bon rôle, on continue
    next();
  };
};