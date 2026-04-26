# Labo API Express ♟️

Application Backend pour la gestion complète de tournois d’échecs. Cette API gère la logique métier complexe : vérification des éligibilités, calcul des scores et génération automatique des rencontres en format Round Robin.

## 🚀 Fonctionnalités principales

- **Gestion des joueurs** : Inscription, rôles (Admin/Member), suivi de l'ELO, hachage sécurisé des mots de passe (Bcrypt) et services d'emailing.
- **Gestion des tournois** : Cycle de vie complet (Création, Inscriptions, Démarrage, Clôture).
- **Système d'Inscriptions** : Validation automatique selon l'âge (Catégories), l'ELO, le genre et la capacité maximale.
- **Moteur de Rencontres** : Génération automatique des matchs lors du lancement du tournoi via l'algorithme **Round Robin**.
- **Scores & Classements** : Calcul en temps réel des points par tournoi et par ronde.
- **Authentification** : Connexion sécurisée via Pseudo ou Email avec gestion de jetons JWT.

---

## 🛠️ Installation et Mise en route

### 1. Prérequis

- **Node.js** 
- **PostgreSQL** installé et en cours d'exécution.
- Un outil de test SMTP (comme **Mailjet**) pour l'envoi d'emails.

### 2. Configuration locale

1. **Cloner le projet** :

   ```bash
   git clone https://github.com/marnarox/labo-api-express.git
   cd labo-api-express

   ```

2. **Installer les dépendances** :
   ```bash
    npm install
   ```
3. **Variables d'environnement** :
   Créez un fichier .env à la racine du projet (utilisez .env.example comme modèle) et configurez les éléments suivants :

- Le port sur lequel le serveur va démarrer

- Informations de connexion à votre base de données PostgreSQL.

- JWT_SECRET pour la sécurité des tokens.

- ENCRYPTION_ROUND pour le hachage des mots de passe.

- Paramètres SMTP pour le service de mail.

### 3. Initialisation de la Base de Données (Seed) ⚠️
Pour que l'application soit fonctionnelle immédiatement avec des données de test (20 utilisateurs, tournois variés et catégories), vous devez lancer le script de seed. Ce script va synchroniser vos tables et peupler la base de données.

   ```bash
    npm run seed
   ```
### 4. Lancer le serveur
```Bash
npm run dev
```
### 🔄 Génération des Matchs (Lancement du tournoi)

Le passage d'un tournoi du statut `en attente` à `en cours` déclenche automatiquement l'algorithme de génération des rencontres.

- **Route dédiée** : `POST /tournament/:id/start`
- **Action associée** : L'appel à cette route exécute le moteur de génération des matchs en format **Round Robin** (chaque joueur rencontre tous les autres).
- **Sécurité et Droits** : 
  - Cette route est protégée par un **Middleware d'authentification**.
  - Seuls les utilisateurs possédant le rôle `admin` sont autorisés à démarrer un tournoi.
  - Le tournoi doit avoir atteint son nombre minimum de joueurs (`playerMin`) pour pouvoir être lancé.
## 🔗 Architecture et Interaction

### Structure du projet

1. **Routage (`/src/routes`)** : Définit les points d'entrée de l'API. C'est ici que sont appliqués les **middlewares** de sécurité (vérification du token JWT, restriction aux administrateurs).
2. **Controllers (`/src/controllers`)** : Reçoivent les requêtes HTTP, extraient les données (`params`, `body`) et formatent la réponse finale (JSON, codes d'état HTTP).
3. **Services (`/src/services`)** : Le cœur de l'application. Ils contiennent toute la logique métier (calculs d'ELO, algorithmes de tournoi) et communiquent avec la base de données.
4. **Entities (`/src/database/entities`)** : Définissent la structure des tables SQL et les relations via l'ORM [Sequelize](https://sequelize.org/).

---

Liaison avec le Frontend
Ce projet est le backend de l'application. Pour une expérience complète, vous devez lancer simultanément le frontend Angular :
[👉 Labo Angular Repository](https://github.com/marnarox/labo-angular).

Ordre de lancement recommandé :

Lancer la base de données PostgreSQL.

Lancer cette API Express (npm run dev) et effectuer le seed.

Lancer le projet Angular (npm run start).