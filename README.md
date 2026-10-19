# SavorCraft — AI-Powered Recipe Book (MERN Stack)

SavorCraft is a digital recipe publication and intelligent culinary companion built with the **MERN Stack** in pure modern JavaScript (ES Modules).

It features an editorial aesthetic (warm cream backgrounds, dark charcoal typography, muted olive-green accents, and verified food photography) combined with micro-animations, scroll-driven storytelling, an interactive serving scaler, full-screen cooking mode, weekly meal planning, grocery checklist, and an AI-powered pantry recipe matcher.

---

## 🌟 Key Features

1. **61 Complete, Verified International Recipes**:
   - 11 Cuisines: Indian (12), Italian (8), Japanese (7), Chinese (6), Mexican (5), Thai (4), Korean (4), Mediterranean (4), French (3), Middle Eastern (3), American & Other (5).
   - Every recipe includes authentic, verified high-resolution food photography (200 OK CDN status checked), accurate measurements, cook/prep times, difficulty, step-by-step instructions with timers and temperatures, chef tips, allergens, and verified nutritional data.

2. **AI Pantry Recipe Finder**:
   - Enter ingredients you currently have using interactive chips or quick-add staple buttons.
   - Cross-references your ingredients against the MongoDB database first, displaying match percentages and specific missing ingredients.
   - When needed, synthesizes bespoke custom recipes tailored to your ingredients, cuisine, dietary styles, and time limits.
   - Includes food safety advisories and 1-click "Save to My Collection" functionality.
   - Modular architecture: compatible with Google Gemini API, OpenAI API, or the Built-in Culinary Intelligence Engine (zero setup required).

3. **Dynamic Serving Size Adjuster**:
   - Interactive `-` / `+` controls on recipe detail pages that dynamically recalculate all ingredient quantities in real-time.

4. **Distraction-Free Cooking Mode**:
   - Fullscreen kitchen walkthrough with large typography, step-by-step checkboxes, and countdown step timers.

5. **Meal Planner & Departmental Shopping List**:
   - 7-day visual meal schedule (Breakfast, Lunch, Dinner).
   - 1-click export from meal plan or recipe directly into an aisle-categorized shopping checklist (Produce, Dairy, Pantry, etc.).

6. **Editorial Visual Design & GSAP / Framer Motion**:
   - Follows `skill.md` (Scroll Experience) and `gsap-core` standards: smooth scroll progress bar, responsive breakpoints, and prefers-reduced-motion accessibility.
   - Print-friendly layout (`@media print` clean recipe cards).

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, JavaScript (JSX), Tailwind CSS, Lucide Icons, GSAP Core, Framer Motion.
- **Backend**: Node.js, Express.js (ES Modules), Mongoose, JWT, bcryptjs, CORS.
- **Database**: MongoDB (Supports MongoDB Atlas or local MongoDB; includes automated Embedded MongoDB zero-setup fallback).
- **AI Integration**: Modular service supporting Gemini, OpenAI, or Built-in Culinary Synthesis.

---

## 🚀 Quick Start Guide

### 1. Installation

Install dependencies for both backend and frontend:

```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

### 2. Configure Environment & MongoDB URI

The server configuration file is located at `server/.env`.

```env
PORT=5000

# MongoDB URI: Paste your MongoDB Atlas URI or local connection string here.
# If left blank, SavorCraft automatically runs an Embedded MongoDB instance
# with all 61 verified recipes, so it works immediately out of the box!
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/savorcraft?retryWrites=true&w=majority

# JWT Authentication Secret
JWT_SECRET=savorcraft_super_secure_jwt_secret_key_2026

# Optional External AI API Keys (Leave blank to use the built-in culinary engine)
GEMINI_API_KEY=
OPENAI_API_KEY=
```

### 3. Run the Development Servers

Open two terminal windows or run:

```bash
# Terminal 1: Backend Server (runs on http://localhost:5000)
cd server
npm run dev

# Terminal 2: Frontend Client (runs on http://localhost:5173)
cd client
npm run dev
```

### 4. Database Seeding & Verification

The server automatically checks and seeds all 61 recipes on first startup. You can also manually seed or verify anytime:

```bash
# Run idempotent database seeder (seeds 61 recipes + demo user account)
npm run seed --prefix server

# Run unit tests (serving scaling, fuzzy pantry matching, AI safety)
npm run test --prefix server

# Verify all 61 recipe photograph URLs (HEAD/GET live CDN status)
node server/src/tests/verifyImages.js
```

### 5. Demo Account Credentials

A pre-seeded chef account is ready for testing:
- **Email**: `demo@savorcraft.com`
- **Password**: `password123`
- Or click the **"Instant Demo Sign-In"** button in the Sign In modal.

---

## 📁 Project Architecture

```
Web Project/
├── client/                     # Vite + React 19 Frontend (JavaScript)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Navbar, Footer, ScrollProgress
│   │   │   ├── recipes/        # RecipeCard, CookingModeModal
│   │   │   └── ui/             # AuthModal
│   │   ├── context/            # AuthContext, FavoritesContext, ShoppingListContext
│   │   ├── pages/              # HomePage, ExplorePage, RecipeDetailPage,
│   │   │                       # AIFinderPage, MealPlannerPage, ShoppingListPage, ProfilePage
│   │   ├── services/           # api.js client SDK
│   │   ├── index.css           # Tailwind base + custom print styling
│   │   └── App.jsx             # Main routing and layout orchestration
│   ├── tailwind.config.js      # Editorial cream, olive, and charcoal theme
│   ├── vite.config.js          # Vite config
│   └── package.json
│
├── server/                     # Express.js Backend (ES Modules JavaScript)
│   ├── src/
│   │   ├── config/             # db.js (MongoDB Atlas + Embedded fallback)
│   │   ├── controllers/        # recipe, ai, auth, user, review controllers
│   │   ├── middleware/         # auth.js, errorHandler.js
│   │   ├── models/             # Recipe, User, Review, MealPlan
│   │   ├── routes/             # recipe, ai, auth, user routes
│   │   ├── seed/               # recipesAsian.js (33), recipesWestern.js (28), seed.js
│   │   ├── services/           # recipeMatcher.js, aiService.js
│   │   ├── tests/              # runTests.js, verifyImages.js
│   │   └── server.js           # Express app & route mounting
│   ├── .env                    # Environment variables (MONGODB_URI)
│   ├── .env.example
│   └── package.json
│
├── .gitignore                  # Git ignore rules for node_modules, .env, dist
├── .env.example                # Root environment template
├── skill.md                    # Scroll Experience guidelines
└── README.md                   # Complete documentation
```
