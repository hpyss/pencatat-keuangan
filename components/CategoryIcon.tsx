import React from 'react';
import {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Film,
  GraduationCap,
  HeartPulse,
  Briefcase,
  Gift,
  MoreHorizontal,
  Home,
  Coffee,
  Plane,
  Tv,
  Smartphone,
  BookOpen,
  DollarSign,
  TrendingUp,
  Tag,
  LucideIcon,
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
}

const iconMap: Record<string, LucideIcon> = {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Film,
  GraduationCap,
  HeartPulse,
  Briefcase,
  Gift,
  MoreHorizontal,
  Home,
  Coffee,
  Plane,
  Tv,
  Smartphone,
  BookOpen,
  DollarSign,
  TrendingUp,
  Tag,
};

export const AVAILABLE_CATEGORY_ICONS = Object.keys(iconMap);

export function CategoryIcon({ name, className = 'w-4 h-4', size = 16 }: CategoryIconProps) {
  const IconComponent = iconMap[name] || Tag;
  return <IconComponent className={className} size={size} />;
}

