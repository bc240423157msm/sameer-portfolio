import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Code2,
  Globe,
  Globe2,
  GraduationCap,
  MessageSquare,
  PenTool,
  Rocket,
  Search,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";

/**
 * Fixed set of icons the admin dashboard can assign (by key) to homepage
 * cards (Services Preview, Why Choose Me, About Intro highlights). Content
 * itself (titles/descriptions) stays fully free-text — only the *icon* is
 * picked from this list, since icons can't be typed as text.
 */
export const ICON_REGISTRY: Record<string, LucideIcon> = {
  globe: Globe,
  globe2: Globe2,
  bot: Bot,
  "shopping-cart": ShoppingCart,
  "pen-tool": PenTool,
  "trending-up": TrendingUp,
  search: Search,
  code: Code2,
  zap: Zap,
  message: MessageSquare,
  "graduation-cap": GraduationCap,
  shield: Shield,
  star: Star,
  rocket: Rocket,
  sparkles: Sparkles,
};

export const ICON_OPTIONS = Object.keys(ICON_REGISTRY) as Array<
  keyof typeof ICON_REGISTRY
>;

export function getIcon(key: string): LucideIcon {
  return ICON_REGISTRY[key] ?? Sparkles;
}
