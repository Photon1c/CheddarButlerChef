import { BookX } from "lucide-react";
import { useState } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import type { Recipe } from "@shared/types";

export default function Library() {
  const { savedRecipes, removeRecipe, updateTags } = useSavedRecipes();
  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "alpha">("newest");

  const allTags = [...new Set(savedRecipes.flatMap((r) => r.tags || []))];

  const filteredRecipes = savedRecipes
    .filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((r) => {
      if (!tagFilter) return true;
      return (r.tags || []).includes(tagFilter);
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.savedAt || 0).getTime() - new Date(a.savedAt || 0).getTime();
      }
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="app-shell">
      <ErrorBoundary>
        <Header recipeCount={savedRecipes.length} />
        <main className="app-main">
          {savedRecipes.length === 0 ? (
            <div className="card text-center py-12 text-[#636e72]">
              <BookX size={48} className="mx-auto mb-4 opacity-50" />
              <p>Your recipe library is empty.</p>
              <p className="text-sm mt-1 opacity-80">
                Save recipes from your searches to build your collection!
              </p>
            </div>
          ) : (
            <div className="card">
              <div className="mb-6">
                <h2>My Recipe Library</h2>
                <div className="flex flex-wrap gap-3 mt-4">
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ingredient-field"
                  />
                  <select
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    className="px-3 py-2 border-2 border-[#dfe6e9] rounded-lg bg-white cursor-pointer"
                  >
                    <option value="">All Tags</option>
                    {allTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as "newest" | "alpha")}
                    className="px-3 py-2 border-2 border-[#dfe6e9] rounded-lg bg-white cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="alpha">A-Z</option>
                  </select>
                </div>
              </div>

              <div className="recipes-grid">
                {filteredRecipes.map((recipe: Recipe, index: number) => (
                  <RecipeCard
                    key={index}
                    recipe={recipe}
                    onRemove={removeRecipe}
                    onUpdateTags={updateTags}
                  />
                ))}
              </div>

              {filteredRecipes.length === 0 && searchTerm && (
                <p className="text-center text-[#636e72] py-8">
                  No recipes match &ldquo;{searchTerm}&rdquo;
                </p>
              )}
            </div>
          )}
        </main>
        <Footer recipeCount={savedRecipes.length} />
      </ErrorBoundary>
    </div>
  );
}