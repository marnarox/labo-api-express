# Labo API Express
## Description
Application Web pour gérer des tournois d’échecs. Les fonctionnalités principales incluent : gestion des joueurs, création et suppression de tournois, inscriptions, génération automatique des rencontres, suivi des scores et rondes.
## Fonctionnalités principales
- Gestion des joueurs : inscription, rôle, ELO, mot de passe haché, envoi d’email.

- Gestion des tournois : création, suppression, affichage des détails, démarrage, suivi des rondes.

- Inscriptions : vérification de l’âge, ELO, genre, capacité maximale.

- Rencontres : génération automatique en Round Robin, modification des résultats.

- Scores : tableau des scores par tournoi et par ronde.

- Authentification : connexion avec pseudo ou email.

## Installation
1. Cloner le projet
2. Configurer votre db(Voir .env.example et créer votre propre.env)
3. Installer les dépendances `npm i`
4. Lancer le serveur `npm run dev`
