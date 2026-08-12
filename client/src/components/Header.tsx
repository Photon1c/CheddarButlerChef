import { BookOpen, Search, UtensilsCrossed } from "lucide-react";
import { useLocation } from "wouter";
import type { ReactNode } from "react";

interface HeaderProps {
  recipeCount: number;
}

export default function Header({ recipeCount }: HeaderProps) {
  const [location] = useLocation();

  const navLink = (href: string, icon: ReactNode, label: string) => (
    <a
      href={href}
      className={`nav-tab ${location === href ? "active" : ""}`}
    >
      {icon}
      {label}
    </a>
  );

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="logo">
          <span className="logo-icon">
            <UtensilsCrossed size={28} className="text-[#ff6b35]" />
          </span>
          <h1>My Chef App</h1>
        </div>
        <nav className="nav-tabs">
          {navLink("/", <Search size={16} />, "Find Recipes")}
          {navLink("/library", <BookOpen size={16} />, `My Library${recipeCount > 0 ? ` (${recipeCount})` : ""}`)}
        </nav>
      </div>
    </header>
  );
}