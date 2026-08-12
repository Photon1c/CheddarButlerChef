import type { Handler } from "@netlify/functions";
import type { Recipe, GenerateRecipesRequest, GenerateRecipesResponse } from "../../shared/types";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const BING_SEARCH_URL = "https://api.bing.microsoft.com/v7.0/search";

async function bingSearch(query: string, count = 1): Promise<{ url: string }[]> {
  const bingKey = process.env.BING_SUBSCRIPTION_KEY;
  if (!bingKey) return [];

  try {
    const response = await fetch(`${BING_SEARCH_URL}?q=${encodeURIComponent(query)}&count=${count}&responseFilter=WebPages`, {
      headers: { "Ocp-Apim-Subscription-Key": bingKey },
    });
    if (response.ok) {
      const data = await response.json();
      return (data.webPages?.value || []).map((v: { url: string }) => ({ url: v.url }));
    }
  } catch (error) {
    console.error("Bing Search Error:", error);
  }
  return [];
}

const handler: Handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ recipes: [], error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}") as GenerateRecipesRequest;
    const { ingredients } = body;

    if (!ingredients || ingredients.trim() === "") {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ recipes: [], error: "No ingredients provided" }),
      };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ recipes: [], error: "OpenAI API key not configured" }),
      };
    }

    const openaiResponse = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              'You are a recipe generator. Output ONLY valid JSON array like: [{"name":"Recipe Name","ingredients":"item1, item2","steps":"step1; step2;"}]',
          },
          { role: "user", content: `Generate 3-5 recipes with ingredients and steps for: ${ingredients}` },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const recipesText = openaiData.choices[0].message.content.trim();

    let recipes: Recipe[] = [];
    try {
      const jsonMatch = recipesText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recipes = JSON.parse(jsonMatch[0]);
      }
    } catch {
      console.log("Failed to parse JSON, using fallback");
    }

    if (recipes.length === 0) {
      recipes = [
        {
          name: recipesText.split("\n")[0].replace(/^\d+\.\s*/, ""),
          url: "",
          ingredients: "",
          steps: "",
        },
      ];
    }

    const limitedRecipes = recipes.slice(0, 5);

    for (const recipe of limitedRecipes) {
      const searchResults = await bingSearch(`${recipe.name} recipe`, 1);
      if (searchResults.length > 0) {
        recipe.url = searchResults[0].url;
      } else {
        recipe.url = `https://www.allrecipes.com/search?q=${encodeURIComponent(recipe.name)}`;
      }
    }

    const response: GenerateRecipesResponse = { recipes: limitedRecipes };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Error generating recipes:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        recipes: [],
        error: error instanceof Error ? error.message : "Failed to generate recipes",
      } satisfies GenerateRecipesResponse),
    };
  }
};

export { handler };