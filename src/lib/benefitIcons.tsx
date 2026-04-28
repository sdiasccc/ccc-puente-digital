import {
  Heart, GraduationCap, Tag, Gift, Dumbbell, Briefcase, Users, Coffee,
  Plane, Car, Home, Stethoscope, Shield, Star, Award, BookOpen, Smile,
  type LucideIcon,
} from 'lucide-react';

export const BENEFIT_ICON_COLOR = '#e63137';

export const benefitIconLibrary: { name: string; Icon: LucideIcon }[] = [
  { name: 'Heart', Icon: Heart },
  { name: 'GraduationCap', Icon: GraduationCap },
  { name: 'Tag', Icon: Tag },
  { name: 'Gift', Icon: Gift },
  { name: 'Dumbbell', Icon: Dumbbell },
  { name: 'Briefcase', Icon: Briefcase },
  { name: 'Users', Icon: Users },
  { name: 'Coffee', Icon: Coffee },
  { name: 'Plane', Icon: Plane },
  { name: 'Car', Icon: Car },
  { name: 'Home', Icon: Home },
  { name: 'Stethoscope', Icon: Stethoscope },
  { name: 'Shield', Icon: Shield },
  { name: 'Star', Icon: Star },
  { name: 'Award', Icon: Award },
  { name: 'BookOpen', Icon: BookOpen },
  { name: 'Smile', Icon: Smile },
];

export function getBenefitIcon(name: string): LucideIcon {
  return benefitIconLibrary.find((i) => i.name === name)?.Icon || Gift;
}