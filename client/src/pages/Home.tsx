import ErrorBoundary from "@/components/ErrorBoundary";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import IngredientInput from "@/components/IngredientInput";
import RecipeResults from "@/components/RecipeResults";
import SpriteStage from "@/components/SpriteStage";
import { useRecipeGeneration } from "@/hooks/useRecipeGeneration";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";

export default function Home() {
  const { recipes, isLoading, generateRecipes } = useRecipeGeneration();
  const { savedRecipes, saveRecipe, removeRecipe, updateTags } = useSavedRecipes();

  return (
    <div className="app-shell">
      <ErrorBoundary>
        <Header recipeCount={savedRecipes.length} />
        <main className="app-main">
          <SpriteStage />
          <IngredientInput onGenerate={generateRecipes} isLoading={isLoading} />
          <RecipeResults recipes={recipes} onSave={saveRecipe} savedRecipes={savedRecipes} />
        </main>
        <Footer recipeCount={savedRecipes.length} />
      </ErrorBoundary>
    </div>
  );
}