import { useState } from "react";
import { toast } from "sonner";
import type { Recipe, GenerateRecipesResponse } from "@shared/types";

export function useRecipeGeneration() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateRecipes = async (ingredients: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: GenerateRecipesResponse = await response.json();
      setRecipes(data.recipes || []);

      if (data.recipes && data.recipes.length > 0) {
        toast.success(`Found ${data.recipes.length} recipe ideas!`);
      } else {
        toast.error("No recipes found. Try different ingredients!");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(`Failed to fetch recipes: ${error instanceof Error ? error.message : "Unknown error"}`);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { recipes, isLoading, generateRecipes };
}