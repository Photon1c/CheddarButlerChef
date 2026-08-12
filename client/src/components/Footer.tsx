import { UtensilsCrossed } from "lucide-react";

interface FooterProps {
  recipeCount: number;
}

export default function Footer({ recipeCount = 0 }: FooterProps) {
  return (
    <footer className="app-footer">
      <p className="m-0 flex items-center justify-center gap-2">
        <UtensilsCrossed size={14} />
        My Chef App — {recipeCount} recipe{recipeCount !== 1 ? "s" : ""} saved
      </p>
    </footer>
  );
}