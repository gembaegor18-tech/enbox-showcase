/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TechnicalSpecs {
  capacity: string;         // e.g. "15 кВт", "50 кВт"
  engineType: string;       // e.g. "Дизельный (Yanmar)"
  noiseLevel: string;       // e.g. "58 дБ (сверхтихий)"
  fuelConsumption: string;  // e.g. "2.4 л/час"
  dimensions: string;       // e.g. "1350x850x1050 мм"
  boxMaterial: string;      // e.g. "Оцинкованная сталь 2мм + полимер"
  weight: string;           // e.g. "340 кг"
}

export interface GeneratorModel {
  id: string;
  name: string;
  category: string;         // e.g. "Премиум Термо-Бокс", "Акустический Кожух"
  slogan: string;
  description: string;
  price: string;
  accentColor: string;      // hex code for the box paint
  doorOptions: string[];    // e.g. ["одностворчатая", "двухстворчатая", "распашная"]
  defaultDoor: string;
  specs: TechnicalSpecs;
  backgroundTheme: 'dark' | 'light' | 'industrial' | 'electric';
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaSubtext: string;
}

export interface CompanySectionContent {
  title: string;
  subtitle: string;
  description: string;
  achievementYear: string;
  achievementText: string;
}

export interface SiteContent {
  hero: HeroContent;
  company: CompanySectionContent;
  generators: GeneratorModel[];
}
