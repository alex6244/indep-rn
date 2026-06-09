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

export const CREDIT_AMOUNT_MIN = 50_000;
export const CREDIT_AMOUNT_MAX = 7_000_000;
export const CREDIT_AMOUNT_STEP = 50_000;
export const DEFAULT_CREDIT_AMOUNT = 1_350_000;

export const DEFAULT_DOWN_PAYMENT = 0;

export const CREDIT_TERM_MONTHS_MIN = 12;
export const CREDIT_TERM_MONTHS_MAX = 84;
export const CREDIT_TERM_MONTHS_STEP = 1;
export const DEFAULT_TERM_MONTHS = 36;
export const CREDIT_TERM_MONTH_PRESETS = [12, 24, 36, 48, 60, 72, 84] as const;

export const AUTO_CREDIT_BANKS: AutoCreditBank[] = [
  { key: "sovcom", label: "Совкомбанк", Icon: SovcomBankIcon },
  { key: "tbank", label: "Т-Банк", Icon: TbankIcon },
  { key: "vtb", label: "ВТБ", Icon: VtbBankIcon },
  { key: "otp", label: "ОТП", Icon: OtpBankIcon },
  { key: "zenit", label: "Зенит", Icon: ZenitBankIcon },
  { key: "gasprom", label: "Газпром", Icon: GaspromBankIcon },
  { key: "alfa", label: "Альфа", Icon: AlfaBankIcon },
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

export const AUTO_CREDIT_DISCLAIMER =
  "Все расчёты приведены в информационных целях и не являются публичной офертой.";
