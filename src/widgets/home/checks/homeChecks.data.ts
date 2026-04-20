import type { ComponentType } from "react";
import type { SvgProps } from "react-native-svg";

import C1 from "../../../assets/mainpage/parameters/tech/1.svg";
import C2 from "../../../assets/mainpage/parameters/tech/2.svg";
import C3 from "../../../assets/mainpage/parameters/tech/3.svg";
import C4 from "../../../assets/mainpage/parameters/tech/4.svg";
import C5 from "../../../assets/mainpage/parameters/tech/5.svg";
import C6 from "../../../assets/mainpage/parameters/tech/6.svg";
import L1 from "../../../assets/mainpage/parameters/law/1.svg";
import L2 from "../../../assets/mainpage/parameters/law/2.svg";
import L3 from "../../../assets/mainpage/parameters/law/3.svg";
import L4 from "../../../assets/mainpage/parameters/law/4.svg";

export type ChecksTechItem = {
  key: string;
  title: string;
  Icon: ComponentType<SvgProps>;
};

export type ChecksLawItem = {
  key: string;
  text: string;
  Icon: ComponentType<SvgProps>;
};

export const techChecks: ChecksTechItem[] = [
  { key: "t1", title: "Пробег авто и его соответствие", Icon: C1 },
  { key: "t2", title: "Состояние, уровень жидкостей в авто", Icon: C2 },
  { key: "t3", title: "Подвеска автомобиля", Icon: C3 },
  { key: "t4", title: "Двигатель", Icon: C4 },
  { key: "t5", title: "Коробка передач", Icon: C5 },
  { key: "t6", title: "Шины и диски", Icon: C6 },
];

export const lawChecks: ChecksLawItem[] = [
  {
    key: "l1",
    text: "Анализ рыночной стоимости автомобиля поможет определить, не завышена ли цена по сравнению с реальной рыночной ценой.",
    Icon: L1,
  },
  {
    key: "l2",
    text: "Расскажем, попадал ли автомобиль в аварии и какие детали могли быть повреждены.",
    Icon: L2,
  },
  {
    key: "l3",
    text: "Автомобиль проверяется на залоги и обременения, чтобы покупка была безопасной.",
    Icon: L3,
  },
  {
    key: "l4",
    text: "Проверим был ли авто в (такси, каршеринге, аресте, угоне).",
    Icon: L4,
  },
];
