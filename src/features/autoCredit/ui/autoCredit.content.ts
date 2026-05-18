import type { ComponentType } from "react";
import type { SvgProps } from "react-native-svg";

import AlfaBankIcon from "../../../assets/banks/alfa.svg";
import GaspromBankIcon from "../../../assets/banks/gasprom.svg";
import OtpBankIcon from "../../../assets/banks/otp.svg";
import SovcomBankIcon from "../../../assets/banks/sovcom.svg";
import TbankIcon from "../../../assets/banks/tbank.svg";
import VtbBankIcon from "../../../assets/banks/vtb.svg";
import ZenitBankIcon from "../../../assets/banks/zenit.svg";

export type AutoCreditBank = {
  key: string;
  label: string;
  Icon?: ComponentType<SvgProps>;
};

export type AutoCreditWhyUsItem = {
  id: string;
  title: string;
  text: string;
};

export type AutoCreditVehicle = {
  id: string;
  brand: string;
  model: string;
  title: string;
  price: number;
  oldPrice?: number;
  year: number;
  images: string[];
  vin: string;
  color: string;
  engineVolume: string;
  ptsStatus: string;
};

export const DOWN_PAYMENT_PERCENTS = [10, 20, 30, 40, 50, 60, 70] as const;
export const CREDIT_TERM_YEARS = [1, 2, 3, 4, 5, 6, 7] as const;

export const DEFAULT_DOWN_PAYMENT_PERCENT = 70;
export const DEFAULT_TERM_YEARS = 7;

export const AUTO_CREDIT_BANKS: AutoCreditBank[] = [
  { key: "sovcom", label: "Совкомбанк", Icon: SovcomBankIcon },
  { key: "tbank", label: "Т-Банк", Icon: TbankIcon },
  { key: "vtb", label: "ВТБ", Icon: VtbBankIcon },
  { key: "sber", label: "Сбер" },
  { key: "otp", label: "ОТП", Icon: OtpBankIcon },
  { key: "zenit", label: "Зенит", Icon: ZenitBankIcon },
  { key: "gasprom", label: "Газпром", Icon: GaspromBankIcon },
  { key: "alfa", label: "Альфа", Icon: AlfaBankIcon },
  { key: "absolut", label: "Абсолют" },
];

export const AUTO_CREDIT_WHY_US: AutoCreditWhyUsItem[] = [
  {
    id: "time",
    title: "Мы экономим ваше время и деньги",
    text: "Рынок автомобилей огромен, но достойных вариантов мало. Мы отсекаем проблемные машины ещё на этапе анализа объявлений, чтобы вы не тратили время впустую. Наша цель — подобрать лучший автомобиль в рамках вашего бюджета, а не просто любой вариант.",
  },
  {
    id: "check",
    title: "Профессиональная техническая проверка",
    text: "Мы проверяем каждый автомобиль более чем по 100 параметрам — от состояния кузова и техники до электроники и юридической истории. Это помогает заранее обнаружить скрытые недостатки и исключить возможные риски.",
  },
  {
    id: "honest",
    title: "Честность и прозрачность",
    text: "Предоставляем подробный отчёт по каждому автомобилю: фото, видеообзор и полную информацию о состоянии. Вы можете объективно оценить машину ещё до осмотра — прозрачно и безопасно.",
  },
  {
    id: "deal",
    title: "Полное сопровождение сделки",
    text: "От первого звонка до передачи ключей — мы рядом. Проверяем документы, сопровождаем на сделке, помогаем с переоформлением и даём рекомендации по дальнейшей эксплуатации.",
  },
];
