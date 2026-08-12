import { Gamepad2, Sparkles } from "lucide-react";

/**
 * SpriteStage — placeholder for the upcoming 2D pixel world.
 *
 * This component scaffolds the area where sprite-sheet animations will live.
 * Future expansions include:
 *   - Animated chef character with walk / chop / serve gestures
 *   - Kitchen environment tiles (stove, counter, pantry)
 *   - Ingredient sprites that react to recipe generation
 *   - Multiple playable characters
 *
 * For now it renders a styled placeholder with a pixel-grid backdrop.
 */
export default function SpriteStage() {
  return (
    <div className="sprite-stage">
      <div className="relative z-10">
        <div className="sprite-placeholder">
          <Gamepad2 size={80} className="text-[#ff6b35] opacity-80" />
        </div>
        <h3 className="text-white text-lg font-semibold mb-1">2D Pixel Kitchen — Coming Soon</h3>
        <p className="text-sm mb-3 max-w-md mx-auto">
          A sprite-sheet animated pixel world is on the way. Watch your chef chop, stir, and plate
          in real time as recipes come together.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs text-white/80">
          <Sparkles size={12} />
          Future expansion: gestures, characters & interactive cooking
        </div>
      </div>
    </div>
  );
}