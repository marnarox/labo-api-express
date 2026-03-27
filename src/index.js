

import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import 'console-separator';
import cors from "cors";
import { errorHandler } from './middlewares/error.middleware.js';

import db from './database/index.js';

import router from './routers/index.js';

import { authentification } from './middlewares/auth.middleware.js';
/*----------------------------------------------- */
import { configure } from 'console-separator';

configure({ 
  char: '—',   // character to repeat
  color: 'magenta' // red, green, yellow, brown, blue, magenta, cyan, white
});
const { APP_PORT } = process.env;

await db.sequelize.authenticate();
await db.sequelize.sync({ alter: true });
const app = express();
app.use(cors({
    origin: "*",
}));

app.use(express.static('public'));

//permet de lire les données des form html
app.use(express.urlencoded({ extended: true }));

//permet de lire les données envoyé au format json (très courant pour les APIs)
app.use(express.json());

//permet d'avoir des logs pour les requêtes
app.use(morgan('dev'));


// Applique le middleware d'authentification à TOUTES les routes qui suivent
app.use(authentification);

// Branchement des routes principales de l'application
app.use(router);

// Middleware de gestion d'erreurs (doit toujours être placé en dernier après les routes)
app.use(errorHandler);

app.listen(APP_PORT, () => {
  console.log(`Web API available at http://localhost:${APP_PORT}`);
});