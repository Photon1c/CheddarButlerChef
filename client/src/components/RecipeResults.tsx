import { Bookmark, BookmarkCheck, ExternalLink, ChefHat } from "lucide-react";
import { useState } from "react";
import type { Recipe } from "@shared/types";

interface RecipeResultsProps {
  recipes: Recipe[];
  onSave: (recipe: Recipe) => void;
  savedRecipes: Recipe[];
}

export default function RecipeResults({ recipes, onSave, savedRecipes }: RecipeResultsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (recipes.length === 0) {
    return (
      <div className="card text-center py-12 text-[#636e72]">
        <ChefHat size={48} className="mx-auto mb-4 opacity-50" />
        <p> Add ingredients and click &ldquo;Find Recipes&rdquo; to discover delicious ideas!</p>
      </div>
    );
  }

  const isSaved = (name: string) => savedRecipes.some((r) => r.name === name);

  return (
    <div className="card">
      <h2>Suggested Recipes</h2>
      <div className="recipes-grid">
        {recipes.map((recipe, index) => (
          <div
            key={index}
            className={`recipe-card ${expandedIndex === index ? "expanded" : ""}`}
          >
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-[#2d3436] mb-1 cursor-pointer break-words"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                {recipe.name} {expandedIndex === index ? "▲" : "▼"}
              </h3>

              {recipe.url && (
                <a
                  href={recipe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#ff6b35] text-sm hover:underline"
                >
                  <ExternalLink size={12} /> View recipe
                </a>
              )}

              {expandedIndex === index && (recipe.ingredients || recipe.steps) && (
                <div className="mt-3 p-3 bg-[#f8f9fa] rounded-lg">
                  {recipe.ingredients && (
                    <div className="mb-2">
                      <strong className="block text-[#2d3436] mb-1 text-sm">Ingredients:</strong>
                      <p className="text-[#2d3436] text-sm m-0">{recipe.ingredients}</p>
                    </div>
                  )}
                  {recipe.steps && (
                    <div>
                      <strong className="block text-[#2d3436] mb-1 text-sm">Steps:</strong>
                      <p className="text-[#2d3436] text-sm m-0">{recipe.steps}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                isSaved(recipe.name)
                  ? "bg-[#27ae60] text-white cursor-default"
                  : "bg-[#ff6b35] text-white hover:bg-[#e55a2b]"
              }`}
              onClick={() => !isSaved(recipe.name) && onSave(recipe)}
              disabled={isSaved(recipe.name)}
            >
              {isSaved(recipe.name) ? (
                <>
                  <BookmarkCheck size={14} /> Saved
                </>
              ) : (
                <>
                  <Bookmark size={14} /> Save
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}