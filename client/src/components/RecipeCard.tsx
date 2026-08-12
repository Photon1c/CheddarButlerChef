import { Trash2, ExternalLink, Tag as TagIcon, Plus } from "lucide-react";
import { useState } from "react";
import type { Recipe } from "@shared/types";

interface RecipeCardProps {
  recipe: Recipe;
  onRemove: (name: string) => void;
  onUpdateTags: (name: string, tags: string[]) => void;
}

export default function RecipeCard({ recipe, onRemove, onUpdateTags }: RecipeCardProps) {
  const [tagInput, setTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const tags = recipe.tags || [];

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        onUpdateTags(recipe.name, [...tags, tagInput.trim()]);
      }
      setTagInput("");
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateTags(recipe.name, tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className={`recipe-card ${expanded ? "expanded" : ""}`}>
      <div className="flex-1 min-w-0">
        <h3
          className="font-semibold text-[#2d3436] mb-2 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {recipe.name} {expanded ? "▲" : "▼"}
        </h3>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map((tag, i) => (
            <span key={i} className="tag-chip">
              <TagIcon size={10} />
              {tag}
              <button onClick={() => handleRemoveTag(tag)}>×</button>
            </span>
          ))}
          <button
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-dashed border-[#dfe6e9] text-[#636e72] text-xs hover:border-[#ff6b35] hover:text-[#ff6b35] transition-colors"
            onClick={() => setShowTagInput(!showTagInput)}
          >
            <Plus size={10} /> Tag
          </button>
        </div>

        {showTagInput && (
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            onBlur={() => setShowTagInput(false)}
            placeholder="Add tag..."
            className="w-full mt-1 px-2.5 py-1 border border-[#ff6b35] rounded-md text-sm"
            autoFocus
          />
        )}

        {recipe.savedAt && (
          <span className="block text-xs text-[#636e72] mb-2">
            Saved {new Date(recipe.savedAt).toLocaleDateString()}
          </span>
        )}

        {expanded && (recipe.ingredients || recipe.steps) && (
          <div className="mt-2 p-3 bg-[#f8f9fa] rounded-lg">
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
      </div>

      <button
        className="bg-none border-none text-lg cursor-pointer opacity-60 hover:opacity-100 transition-opacity p-1"
        onClick={() => onRemove(recipe.name)}
        title="Remove from library"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}