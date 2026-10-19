import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { Recipe } from './models/Recipe.js';
import { seedDatabase } from './seed/seed.js';
import recipeRoutes from './routes/recipeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: '*', // Allows local frontend on any port (5173, 3000, etc.)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging in development
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const recipeCount = await Recipe.countDocuments();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    recipesInDatabase: recipeCount,
    aiProviderConfigured: Boolean(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY)
  });
});

// API Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Database initialization and server startup
const startServer = async () => {
  try {
    await connectDB();

    // Check if recipes are seeded, auto-seed if empty or count < 60
    const count = await Recipe.countDocuments();
    if (count < 60) {
      console.log(`[Server] Detected ${count} recipes in database. Auto-seeding 61 verified international recipes...`);
      await seedDatabase();
    } else {
      console.log(`[Server] Database ready with ${count} recipes.`);
    }

    const server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  SavorCraft Backend API Running on http://localhost:${PORT}`);
      console.log(`  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`  Recipes API:  http://localhost:${PORT}/api/recipes`);
      console.log(`  AI Finder:    http://localhost:${PORT}/api/ai/recommend`);
      console.log(`====================================================`);
    });

    return server;
  } catch (error) {
    console.error('[Server] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
