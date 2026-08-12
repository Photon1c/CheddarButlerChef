import { useEffect, useState } from "react";
import { STORAGE_KEY } from "@shared/const";
import type { Recipe } from "@shared/types";

export function useSavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedRecipes(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved recipes:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  const saveRecipe = (recipe: Recipe) => {
    if (!savedRecipes.find((r) => r.name === recipe.name)) {
      setSavedRecipes([...savedRecipes, { ...recipe, savedAt: new Date().toISOString() }]);
    }
  };

  const removeRecipe = (recipeName: string) => {
    setSavedRecipes(savedRecipes.filter((r) => r.name !== recipeName));
  };

  const updateTags = (recipeName: string, tags: string[]) => {
    setSavedRecipes(savedRecipes.map((r) => (r.name === recipeName ? { ...r, tags } : r)));
  };

  return { savedRecipes, saveRecipe, removeRecipe, updateTags };
}