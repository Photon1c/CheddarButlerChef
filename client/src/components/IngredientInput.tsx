import { Plus, X, Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface IngredientInputProps {
  onGenerate: (ingredients: string) => Promise<void>;
  isLoading: boolean;
}

export default function IngredientInput({ onGenerate, isLoading }: IngredientInputProps) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredient();
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setIngredients([]);
    setInputValue("");
  };

  const handleSubmit = async () => {
    if (ingredients.length === 0) {
      toast.error("Add at least one ingredient first!");
      return;
    }
    await onGenerate(ingredients.join(", "));
  };

  return (
    <div className="card">
      <h2>What's in your kitchen?</h2>
      <p className="text-[#636e72] text-sm mb-6">
        Add ingredients one at a time — press <kbd className="px-1.5 py-0.5 bg-[#e3f2fd] rounded text-xs">Enter</kbd> or
        <kbd className="px-1.5 py-0.5 bg-[#e3f2fd] rounded text-xs ml-1">,</kbd> to add
      </p>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type an ingredient..."
          className="ingredient-field"
          disabled={isLoading}
        />
        {inputValue.trim() && (
          <button
            type="button"
            onClick={addIngredient}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#ff6b35] text-white hover:bg-[#e55a2b] transition-colors flex-shrink-0"
            title="Add ingredient"
          >
            <Plus size={18} />
          </button>
        )}
        {(ingredients.length > 0 || inputValue) && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#636e72] text-white hover:bg-[#2d3436] transition-colors flex-shrink-0"
            title="Clear all"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 min-h-[40px]">
          {ingredients.map((ing, index) => (
            <span key={index} className="ingredient-chip">
              {ing}
              <button type="button" onClick={() => removeIngredient(index)}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        className="search-btn"
        disabled={ingredients.length === 0 || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Finding recipes...</span>
          </>
        ) : (
          <>
            <Search size={18} />
            <span>Find Recipes</span>
          </>
        )}
      </button>
    </div>
  );
}