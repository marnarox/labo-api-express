import 'dotenv/config';
import db from '../index.js';
import { userData } from './user.data.js';
import { categoryData } from './category.data.js';
import { tournamentData } from './tournament.data.js';
import userService from '../../services/user.service.js';

const runSeed = async () => {
  try {
    // Force: true va vider la DB avant de recréer les tables
    await db.sequelize.sync({ force: true });
    console.log("♻️ Database synchronisée (vidée).");

    // 1. Seed Categories
    const categories = await db.Category.bulkCreate(categoryData);
    console.log("✅ Catégories créées.");

    // 2. Seed Users
    const createdUsers = [];
    for (const user of userData) {
      const newUser = await userService.create(user);
      createdUsers.push(newUser);
      console.log(`👤 User ${newUser.nickname} créé.`);
    }

    // 3. Seed Tournaments
    const admin = createdUsers.find(u => u.role === 'admin') || createdUsers[0];
    
    for (const t of tournamentData) {
      const tournament = await db.Tournament.create({
        ...t,
        organizerId: admin.id // On assigne l'admin comme organisateur par défaut
      });
      
      // On lie chaque tournoi à toutes les catégories pour le test
      await tournament.setCategories(categories);
      console.log(`🏆 Tournoi ${tournament.name} créé.`);
    }

    console.log("✨ Seeding complet !");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur de seeding :", error);
    process.exit(1);
  }
};

runSeed();