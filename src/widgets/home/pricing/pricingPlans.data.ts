import type { ComponentType } from "react";
import type { SvgProps } from "react-native-svg";
import ServiceBg1 from "../../../assets/mainpage/services/1.svg";
import ServiceBg2 from "../../../assets/mainpage/services/2.svg";
import ServiceBg3 from "../../../assets/mainpage/services/3.svg";

export type PricingPlan = {
  id: string;
  title: string;
  intro: string;
  listTitle: string;
  bullets: string[];
  price: string;
  Bg: ComponentType<SvgProps>;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "day",
    title: "Автоподборщик на день",
    intro: "Это услуга для тех, кто хочет доверить поиск и проверку автомобиля профессионалу.",
    listTitle: "В течение дня наш специалист:",
    bullets: [
      "Подбирает автомобили по вашим критериям: бюджет, марка, модель, комплектация",
      "Проверяет юридическую чистоту: отсутствие обременений, кредитов, ограничений",
      "Консультирует по каждой сделке и помогает принять окончательное решение",
    ],
    price: "12 000 ₽",
    Bg: ServiceBg1,
  },
  {
    id: "one",
    title: "Разовая диагностика",
    intro: "Это услуга для тех, кто хочет быстро и точно проверить состояние автомобиля перед покупкой.",
    listTitle: "В услугу включено:",
    bullets: [
      "Подборщик осматривает автомобиль и проверяет ключевые узлы",
      "Проверяет двигатель, подвеску и электронику, оценивая их работу и выявляя возможные проблемы.",
      "Проверяет скрытые поломки и проблемы, которые могут проявиться в будущем.",
    ],
    price: "12 000 ₽",
    Bg: ServiceBg2,
  },
  {
    id: "mileage",
    title: "Подбор авто с пробегом под ключ",
    intro: "Для тех, кто хочет купить подержанный автомобиль без забот.",
    listTitle: "В услуге:",
    bullets: [
      "Подбор автомобиля с пробегом по вашим критериям: марка, модель, комплектация, цена",
      "Проверка юридической чистоты и сопровождение сделки",
      "Передача автомобиля с полным пакетом документов и рекомендациями по эксплуатации",
    ],
    price: "12 000 ₽",
    Bg: ServiceBg3,
  },
];
