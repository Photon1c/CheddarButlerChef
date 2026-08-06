const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3005;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '10mb' }));

const API_KEYS_LOADED = !!(process.env.OPENAI_API_KEY && process.env.BING_SUBSCRIPTION_KEY);
console.log('API Keys loaded:', API_KEYS_LOADED);

let credentials = null;
// SSL disabled for local development - uncomment to enable HTTPS
// try {
//   const keyPath = path.join(__dirname, 'server.key');
//   const certPath = path.join(__dirname, 'server.cert');
//   if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
//     const privateKey = fs.readFileSync(keyPath, 'utf8');
//     const certificate = fs.readFileSync(certPath, 'utf8');
//     credentials = { key: privateKey, cert: certificate };
//     console.log('SSL certificates loaded successfully');
//   }
// } catch (err) {
//   console.log('SSL certificates not found, using HTTP');
// }

async function bingSearch(query, count = 1) {
  if (!process.env.BING_SUBSCRIPTION_KEY) {
    console.warn('Bing API key not configured');
    return [];
  }
  
  const baseUrl = "https://api.bing.microsoft.com/v7.0/search";
  const headers = {
    "Ocp-Apim-Subscription-Key": process.env.BING_SUBSCRIPTION_KEY,
  };
  const params = {
    q: query,
    count: count,
    responseFilter: "WebPages",
  };

  try {
    const response = await axios.get(baseUrl, { headers, params });
    if (response.status === 200) {
      return response.data.webPages.value;
    }
  } catch (error) {
    console.error(`Bing Search Error: ${error.message}`);
  }
  return [];
}

app.post('/generate-recipes', async (req, res) => {
  const { ingredients } = req.body;
  const clientIp = req.ip;
  console.log(`Received ingredients from ${clientIp}:`, ingredients);

  if (!ingredients || ingredients.trim() === '') {
    return res.status(400).json({ recipes: [], error: 'No ingredients provided' });
  }

  if (!API_KEYS_LOADED) {
    return res.status(500).json({ recipes: [], error: 'API keys not configured' });
  }

  try {
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a recipe generator. Output ONLY valid JSON array like: [{"name":"Recipe Name","ingredients":"item1, item2","steps":"step1; step2;"}]' },
          { role: 'user', content: `Generate 3-5 recipes with ingredients and steps for: ${ingredients}` }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const recipesText = openaiResponse.data.choices[0].message.content.trim();
    console.log(`Recipes text for request from ${clientIp}:`, recipesText);

    let recipes = [];
    try {
      const jsonMatch = recipesText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recipes = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.log('Failed to parse JSON, using fallback');
    }
    
    if (recipes.length === 0) {
      recipes = [{ name: recipesText.split('\n')[0].replace(/^\d+\.\s*/, ''), url: '', ingredients: '', steps: '' }];
    }

    const limitedRecipes = recipes.slice(0, 5);
    
    for (const recipe of limitedRecipes) {
      const searchResults = await bingSearch(recipe.name + ' recipe', 1);
      if (searchResults.length > 0) {
        recipe.url = searchResults[0].url;
      } else {
        const encoded = encodeURIComponent(recipe.name);
        recipe.url = `https://www.allrecipes.com/search?q=${encoded}`;
      }
    }

    console.log(`Processed recipes for request from ${clientIp}:`, limitedRecipes.length, 'recipes');
    res.status(200).json({ recipes: limitedRecipes });
  } catch (error) {
    console.error(`Error generating recipes for request from ${clientIp}:`, error.response?.data || error.message);
    res.status(500).json({ recipes: [], error: 'Failed to generate recipes' });
  }
});

if (credentials) {
  const https = require('https');
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(port, '0.0.0.0', () => {
    console.log(`HTTPS Server running on https://0.0.0.0:${port}`);
  });
} else {
  app.listen(port, '0.0.0.0', () => {
    console.log(`HTTP Server running on http://0.0.0.0:${port}`);
  });
}