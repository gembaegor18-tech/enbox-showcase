/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SiteContent } from './types';

// Import local compiled images so Vite bundles them properly for production
import boxInsideTechnical from './assets/images/внутрянка.png';
import avrBoxImage from './assets/images/ящик_авр.png';
import exhaustImage from './assets/images/выхлоп.png';
import batboxRealInstallation from './assets/images/главная.png';
import greenWood from './assets/images/гл_зеленый_дер.png';
import blackCopper from './assets/images/гл_черный_медь.png';
import greyWood from './assets/images/гл_серый_дер.png';
import greySolid from './assets/images/гл_серый.png';
import blueBeige from './assets/images/гл_голубой_беж.png';
import bluePink from './assets/images/гл_голубой_розовый.png';
import whiteBlack from './assets/images/гл_белый,_черный.png';
import redWood from './assets/images/гл_красный_дер.png';

export interface ColorVariation {
  id: string;
  name: string;
  nameRu: string;
  image: string;
  description: string;
  accentColor: string;
}

export const COLOR_VARIATIONS: ColorVariation[] = [
  {
    id: "green-wood",
    name: "Forest Green & Wood",
    nameRu: "Хвойный зеленый и дерево",
    image: greenWood,
    description: "Хвойный зеленый оттенок рамы гармонично сочетается с натуральной текстурой дерева, прекрасно вписываясь в любой дачный или лесной пейзаж.",
    accentColor: "#15803d"
  },
  {
    id: "black-copper",
    name: "Charred Black & Copper",
    nameRu: "Угольный черный и медный",
    image: blackCopper,
    description: "Глубокий матовый черный каркас акцентирован теплыми медными деталями и ручками. Стильное решение.",
    accentColor: "#b45309"
  },
  {
    id: "grey-wood",
    name: "Classic Grey & Warm Wood",
    nameRu: "Серый каркас и натуральное дерево",
    image: greyWood,
    description: "Сдержанный серый каркас с фасадами из дерева. Универсальный скандинавский дизайн для любого современного дома.",
    accentColor: "#64748b"
  },
  {
    id: "grey-solid",
    name: "Slate Anthracite Grey",
    nameRu: "Матовый графит",
    image: greySolid,
    description: "Элегантное серое монохромное исполнение. Подчеркивает форму и современный стиль вашей загородной резиденции.",
    accentColor: "#475569"
  },
  {
    id: "blue-beige",
    name: "Sky Blue & Soft Beige",
    nameRu: "Темно-синий и бежевый",
    image: blueBeige,
    description: "Свежее и легкое сочетание синих вентиляционных решеток с мягким бежевым деревянным фасадом.",
    accentColor: "#0ea5e9"
  },
  {
    id: "blue-pink",
    name: "Blue Azure & Soft Pink",
    nameRu: "Голубая лазурь и розовый",
    image: bluePink,
    description: "Неординарное дизайнерское исполнение. Контраст матовой розовой древесины и лазурных деревянных решеток.",
    accentColor: "#ec4899"
  },
  {
    id: "white-black",
    name: "Minimalist White & Deep Black",
    nameRu: "Контрастный белый и черный",
    image: whiteBlack,
    description: "Классический скандинавский минимализм в максимальном контрасте. Чистый белоснежный кант на фоне черных ламелей.",
    accentColor: "#e4e4e7"
  },
  {
    id: "red-wood",
    name: "Coral Red & Natural Wood",
    nameRu: "Коралловый красный и дерево",
    image: redWood,
    description: "Яркий и харизматичный вариант. Насыщенный красный цвет окантовки добавляет динамики и стильно выделяется на загородном участке.",
    accentColor: "#dc2626"
  }
];

export const TECHNICAL_PHOTOS = {
  inside: {
    title: "Что находится внутри бокса?",
    image: boxInsideTechnical,
    description: "Просторное внутреннее пространство: бензиновый генератор 8.3 кВт на виброопорах, негорючая звукоизоляция из базальтового волокна на стенах, принудительный вентилятор обдува с термодатчиком для охлаждения цилиндра и гибкий гофрированный металлорукав отвода газов наружу."
  },
  exhaust: {
    title: "Система отвода выхлопных газов",
    image: exhaustImage,
    description: "Герметичное резьбовое соединение с глушителем генератора через высокотемпературный гибкий сильфонный металлорукав из нержавеющей стали AISI 304, выводящий выхлоп через внешнюю вентиляционную стенку бокса."
  },
  runsLed: {
    title: "Умное управление и АВР",
    image: avrBoxImage,
    description: "Блок автоматического программирования АВР со светодиодным дисплеем статуса работы 'RUN', фазовыми предохранителями и автоматическим переключателем питания дома на резерв при выключении центральной сети."
  },
  woodSide: {
    title: "Форма, эргономика и крышка",
    image: batboxRealInstallation,
    description: "Элегантный боковой профиль. Прочные деревянные ручки на верхней крышке с газовыми упорами (лифтами) для плавного и легкого доступа к заправочной горловине без физических усилий."
  },
  collage: {
    title: "Палитра исполнений bat box",
    image: batboxRealInstallation,
    description: "Наш сборочный цех готов покрасить бокс в любой базовый тон бесплатно из нашей палитры, либо индивидуально подобрать колер по шкале RAL в стиль вашего дизайна, фасада дома или ворот."
  }
};

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    eyebrow: "ПРОФЕССИОНАЛЬНОЕ РЕЗЕРВНОЕ ЭНЕРГОСНАБЖЕНИЕ ДЛЯ ДОМА",
    title: "ПРОФЕССИОНАЛЬНОЕ РЕЗЕРВНОЕ ЭНЕРГОСНАБЖЕНИЕ ДЛЯ ДОМА BAT BOX",
    subtitle: "Готовый силовой узел на базе бензинового генератора 8.3 кВт с программируемым автоматическим включением резерва (АВР) «под ключ».",
    ctaText: "Рассчитать комплект",
    ctaSubtext: ""
  },
  company: {
    title: "Инженерная Мануфактура bat box",
    subtitle: "Собираем премиальные деревянные всепогодные боксы и щиты АВР с любовью к деталям.",
    description: "Мы вручную изготавливаем вентилируемые шумозащитные боксы из сухого дерева ГОСТ повышенной плотности и прочного листового металла. Боксы оснащаются глушителями шума, системой принудительного охлаждения и автоматическим подогревом двигателя для уверенного загородного зимнего пуска. Каждый проект включает тепловой рассчет, прокладку силового кабеля, установку блока АВР для мгновенного резервирования мощности при аварии на ЛЭП. Соседи не заметят шума, а ваши приборы останутся в безопасности.",
    achievementYear: "99 000 ₽",
    achievementText: "Стоимость готовой электрогенераторной установки совместно с щитом АВР автозапуска."
  },
  generators: [
    {
      id: "batbox-bga-8000e",
      name: "bat box Смарт-Резерв",
      category: "Коттеджный Стандарт",
      slogan: "Тихий и мощный резерв напряжения загородного дома",
      description: "Всепогодная электростанция на базе оригинального бензинового генератора мощностью 8.3 кВт. Конструкция доработана нашими инженерами: оборудована автоматическими жалюзи вентиляции, системой выхлопа через гибкий металлорукав, щитом АВР с микропроцессором и датчиками.",
      price: "99 000 ₽",
      accentColor: "#d97706",
      doorOptions: ["одностворчатая крышка", "двухстворчатый фасад", "крышка на газовых упорах"],
      defaultDoor: "крышка на газовых упорах",
      specs: {
        capacity: "8.3 кВт (Максимальная мощность, 8.5 кВА полная)",
        engineType: "Синхронный бензиновый (4-тактный, 100% медная обмотка, бак 25 л)",
        noiseLevel: "55 дБ в шумозащитном боксе (собственный шум генератора 85 дБ)",
        fuelConsumption: "3.2 л/час (до 8 часов непрерывной работы на полном баке)",
        dimensions: "1250x850x1000 мм (оптимальные размеры для установки на подготовленное основание)",
        boxMaterial: "Сухой профилированный брус + негорючая базальтовая изоляция 50 мм + полимерная битумная черепица",
        weight: "90 кг (генератор) + 80 кг (премиальный бокс)"
      },
      backgroundTheme: "light"
    }
  ]
};
