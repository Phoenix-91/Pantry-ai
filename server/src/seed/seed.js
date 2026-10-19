import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB, closeDB } from '../config/db.js';
import { Recipe } from '../models/Recipe.js';
import { User } from '../models/User.js';
import { allRecipes } from './recipesData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const seedDatabase = async () => {
  try {
    console.log(`[Seeder] Starting idempotent database seed (${allRecipes.length} recipes)...`);
    
    let inserted = 0;
    let updated = 0;

    for (const recipe of allRecipes) {
      const existing = await Recipe.findOne({ slug: recipe.slug });
      if (existing) {
        await Recipe.updateOne({ slug: recipe.slug }, { $set: recipe });
        updated++;
      } else {
        await Recipe.create(recipe);
        inserted++;
      }
    }

    console.log(`[Seeder] Recipe sync complete: ${inserted} inserted, ${updated} updated. Total in DB: ${await Recipe.countDocuments()}`);

    // Create demo user if does not exist (idempotent)
    const demoEmail = 'demo@savorcraft.com';
    let demoUser = await User.findOne({ email: demoEmail });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Chef Alexandra Sterling',
        email: demoEmail,
        password: 'password123',
        bio: 'Culinary explorer and recipe developer dedicated to authentic global flavors.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        dietaryPreferences: ['High-Protein']
      });
      console.log(`[Seeder] Created demo user account: ${demoEmail} / password123`);
    } else {
      console.log(`[Seeder] Demo user already exists: ${demoEmail}`);
    }

    console.log('[Seeder] Database seeding finished successfully.');
    return { success: true, count: await Recipe.countDocuments() };
  } catch (error) {
    console.error('[Seeder] Error during database seeding:', error);
    throw error;
  }
};

// If run directly from CLI
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  (async () => {
    await connectDB();
    await seedDatabase();
    await closeDB();
    process.exit(0);
  })();
}
