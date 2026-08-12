# My Chef App

An interactive, LLM-powered recipe builder: tell it what's in your kitchen, and it suggests recipes you can make right now. Built with Vite + React + TypeScript + Tailwind CSS, deployed on Netlify.

![App Screenshot](/multimedia/screenshot.PNG)

## Features

- **Recipe Builder from Ingredients** — Type ingredients one at a time, hit "Find Recipes," and an LLM (OpenAI GPT-3.5-turbo) generates 3-5 recipe ideas with ingredients and steps.
- **Save & Organize** — Save recipes to your library, add custom tags, search, filter, and sort.
- **Bing Search Enrichment** — Each recipe gets a real recipe link via Bing Search.
- **2D Pixel World (Coming Soon)** — A sprite-sheet animated pixel kitchen where a chef character cooks in real time. See the [Future Roadmap](#future-roadmap--2d-pixel-world) below.

## User Guide

### How to Use

1. **Add Ingredients** — On the home page, type an ingredient in the text field and press `Enter` or `,` to add it. Repeat for each ingredient.
2. **Find Recipes** — Click the "Find Recipes" button. The app sends your ingredients to the LLM, which returns recipe ideas.
3. **View Details** — Click any recipe card to expand and see its full ingredients and steps.
4. **Save Recipes** — Click the "Save" button on any recipe to add it to your library.
5. **Manage Your Library** — Navigate to "My Library" via the header. There you can:
   - Search recipes by name
   - Filter by tags
   - Sort by newest or alphabetical
   - Add custom tags to organize recipes
   - Remove recipes you no longer want

### Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env and add your OpenAI API key (and optionally Bing Search key)

# 3. Start the dev server
npm run dev
# App runs at http://localhost:3000

# 4. Build for production
npm run build

# 5. Preview the production build
npm run preview
```

## Environment Variables

| Variable              | Required | Description                                          |
| --------------------- | -------- | ---------------------------------------------------- |
| `OPENAI_API_KEY`      | Yes      | OpenAI API key for GPT-3.5-turbo recipe generation   |
| `BING_SUBSCRIPTION_KEY` | No      | Bing Search API key for recipe URL enrichment        |

Copy `.env.example` to `.env` and fill in your keys.

## Deploy to Netlify

This project is pre-configured for one-click Netlify deployment:

1. **Push to GitHub** — Push this repo to a GitHub repository.
2. **Connect to Netlify** — Go to [netlify.com](https://app.netlify.com), click "Add new site" > "Import an existing project," and select your repository.
3. **Build Settings** — Netlify will auto-detect the `netlify.toml` config:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
4. **Set Environment Variables** — In Netlify's Site settings > Environment variables, add:
   - `OPENAI_API_KEY` — your OpenAI key
   - `BING_SUBSCRIPTION_KEY` — (optional) your Bing Search key
5. **Deploy** — Click "Deploy site." Netlify will build and deploy automatically.

### How Netlify Functions Work

The backend API is a serverless Netlify Function (`netlify/functions/generate-recipes.ts`). It:

- Receives `POST /api/generate-recipes` with `{ "ingredients": "tomato, garlic, basil" }`
- Calls OpenAI's GPT-3.5-turbo to generate 3-5 recipes
- Optionally enriches each recipe with a Bing Search link
- Returns `{ "recipes": [...] }`

The `netlify.toml` file redirects `/api/generate-recipes` to the serverless function automatically.

## Tech Stack

| Area         | Technology                                            |
| ------------ | ---------------------------------------------------- |
| Framework    | React 19 + TypeScript                                 |
| Build tool   | Vite 7                                               |
| Styling      | Tailwind CSS v4                                       |
| Routing      | wouter (lightweight client-side router)              |
| Icons        | lucide-react                                         |
| Toasts       | sonner                                               |
| LLM Backend  | OpenAI GPT-3.5-turbo via Netlify Functions           |
| Deployment   | Netlify (static hosting + serverless functions)       |

## Project Structure

```
my-chef-app/
  client/                    # Vite frontend
    index.html
    src/
      App.tsx               # Root component with wouter router
      main.tsx              # React entry point
      index.css             # Tailwind + custom styles
      const.ts              # Re-exports shared constants
      components/
        ErrorBoundary.tsx    # Global error catch
        Header.tsx           # Top nav with tabs
        Footer.tsx           # Footer with recipe count
        IngredientInput.tsx  # Ingredient chip input + search
        RecipeResults.tsx    # LLM-generated recipe cards
        RecipeCard.tsx       # Saved recipe card with tags
        SpriteStage.tsx      # Placeholder for 2D pixel world
      pages/
        Home.tsx             # Recipe builder page
        Library.tsx          # Saved recipes library
        NotFound.tsx         # 404 page
      hooks/
        useRecipeGeneration.ts  # LLM recipe fetch hook
        useSavedRecipes.ts       # localStorage persistence hook
      lib/
        utils.ts              # cn() Tailwind merge utility
      vite-env.d.ts           # Vite type declarations
  netlify/
    functions/
      generate-recipes.ts     # Serverless LLM recipe API
  shared/
    const.ts                  # Shared constants (STORAGE_KEY, etc.)
    types.ts                  # Shared TypeScript types (Recipe, etc.)
  netlify.toml                # Deployment config (build, redirects, headers)
  package.json
  vite.config.ts
  tsconfig.json
  tsconfig.node.json
  .env.example
  .prettierrc
  README.md
```

## Future Roadmap — 2D Pixel World

The `SpriteStage` component on the home page is a placeholder for an upcoming **2D pixel art kitchen world** with sprite-sheet animations. Planned expansions:

### Phase 1: Sprite-Sheet Core
- Animated chef character with walk, chop, stir, and plate gestures
- Kitchen environment tiles (stove, counter, pantry, fridge)
- Ingredient sprites that visually drop into the pot when added

### Phase 2: Interactive Cooking
- Recipe generation triggers cooking animations (chopping, stirring, plating)
- Heat-level visualization matching the recipe results
- Particle effects: steam, sparks, ingredient tosses

### Phase 3: Character & Gesture Expansion
- Multiple playable characters (sous-chef, pastry chef, grill master)
- Gesture system: tap to chop, drag to stir, swipe to flip
- Seasonal/event characters with unique animations

### Phase 4: World Expansion
- Walkable kitchen world with rooms (pantry, garden, market)
- Quest system: "cook 5 Italian recipes" unlocks new areas
- Ingredient garden: grow and harvest ingredients over time

The architecture is designed to make this expansion straightforward — `SpriteStage.tsx` is the integration point, and the recipe generation hooks are already decoupled from the animation layer.

## License

MIT — Created by Leslie Cuadre Palacios