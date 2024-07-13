const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

console.log('OpenAI API Key:', process.env.OPENAI_API_KEY);

app.post('/generate-recipes', async (req, res) => {
  const { ingredients } = req.body;
  console.log('Received ingredients:', ingredients);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates recipes based on ingredients.' },
          { role: 'user', content: `Generate a list of 3-5 recipes with their names and URLs based on the following ingredients: ${ingredients}` }
        ],
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('OpenAI response:', response.data);
    const recipesText = response.data.choices[0].message.content.trim();
    console.log('Recipes text:', recipesText);

    const recipes = [];
    const lines = recipesText.split('\n').map(line => line.trim()).filter(line => line);

    let currentRecipe = null;

    lines.forEach(line => {
      if (/^\d+\.\s/.test(line)) {
        // This line starts with a number and a dot, so it is a recipe title
        if (currentRecipe) {
          recipes.push(currentRecipe);
        }
        currentRecipe = { name: line.replace(/^\d+\.\s/, '').trim(), url: '' };
      } else if (line.startsWith('- URL:')) {
        if (currentRecipe) {
          const urlMatch = line.match(/\[(.*?)\]\((.*?)\)/);
          if (urlMatch) {
            currentRecipe.url = urlMatch[2];
          }
        }
      }
    });

    if (currentRecipe) {
      recipes.push(currentRecipe);
    }

    console.log('Processed recipes:', recipes);
    res.status(200).json({ recipes });
  } catch (error) {
    console.error('Error generating recipes:', error.response ? error.response.data : error.message);
    res.status(500).json({ recipes: [], error: 'Failed to generate recipes' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
