import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";
import validator from "validator";

zxcvbnOptions.setOptions({
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
});

const PASSWORD_SCORE_THRESHOLD = 3;

const FEEDBACK_RU: Record<string, string> = {
  // warnings
  "Straight rows of keys on your keyboard are easy to guess.":
    "Ряды клавиш на клавиатуре легко угадать.",
  "Short keyboard patterns are easy to guess.":
    "Короткие паттерны клавиатуры легко угадать.",
  'Repeated characters like "aaa" are easy to guess.':
    "Повторяющиеся символы вроде «aaa» легко угадать.",
  'Repeated character patterns like "abcabcabc" are easy to guess.':
    "Повторяющиеся паттерны вроде «abcabc» легко угадать.",
  'Common character sequences like "abc" are easy to guess.':
    "Распространённые последовательности вроде «abc» легко угадать.",
  "Recent years are easy to guess.": "Недавние годы легко угадать.",
  "Dates are easy to guess.": "Даты легко угадать.",
  "This is a heavily used password.": "Это очень распространённый пароль.",
  "This is a frequently used password.": "Этот пароль часто используют.",
  "This is a commonly used password.": "Это распространённый пароль.",
  "This is similar to a commonly used password.":
    "Пароль похож на распространённые.",
  "Single words are easy to guess.": "Одно слово легко угадать.",
  "Single names or surnames are easy to guess.":
    "Имена и фамилии легко угадать.",
  "Common names and surnames are easy to guess.":
    "Распространённые имена и фамилии легко угадать.",
  "There should not be any personal or page related data.":
    "Пароль не должен содержать личные данные.",
  "Your password was exposed by a data breach on the Internet.":
    "Этот пароль засветился в утечках данных.",
  // suggestions
  "Avoid predictable letter substitutions like '@' for 'a'.":
    "Избегайте замен букв символами, например @ вместо a.",
  "Avoid reversed spellings of common words.":
    "Избегайте слов, написанных задом наперёд.",
  "Capitalize some, but not all letters.":
    "Используйте заглавные буквы, но не везде.",
  "Capitalize more than the first letter.":
    "Используйте заглавные буквы не только в начале.",
  "Avoid dates and years that are associated with you.":
    "Избегайте дат и годов, связанных с вами.",
  "Avoid recent years.": "Избегайте использовать недавние годы.",
  "Avoid years that are associated with you.":
    "Избегайте годов, связанных с вами.",
  "Avoid common character sequences.":
    "Избегайте распространённых последовательностей символов.",
  "Avoid repeated words and characters.":
    "Избегайте повторяющихся слов и символов.",
  "Use longer keyboard patterns and change typing direction multiple times.":
    "Используйте более длинные паттерны и меняйте направление набора.",
  "Add more words that are less common.":
    "Добавьте ещё одно-два редких слова.",
  "Use multiple words, but avoid common phrases.":
    "Используйте несколько слов, избегая распространённых фраз.",
  "You can create strong passwords without using symbols, numbers, or uppercase letters.":
    "Надёжный пароль можно создать без символов, цифр и заглавных букв.",
  "If you use this password elsewhere, you should change it.":
    "Если вы используете этот пароль где-то ещё — смените его.",
};

const DEFAULT_WEAK_FEEDBACK = "Придумайте более надёжный пароль.";

function toRu(text: string | null | undefined): string | undefined {
  if (!text) return undefined;
  return FEEDBACK_RU[text] ?? text;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isEmailValid(email: string): boolean {
  return validator.isEmail(email);
}

export function getPasswordStrength(
  password: string,
  userInputs: string[] = [],
): { score: number; isStrongEnough: boolean; feedback?: string } {
  if (!password) {
    return { score: 0, isStrongEnough: false, feedback: "Введите пароль." };
  }

  const result = zxcvbn(password, userInputs);
  const score = result.score as number;
  const isStrongEnough = score >= PASSWORD_SCORE_THRESHOLD;

  if (isStrongEnough) {
    return { score, isStrongEnough };
  }

  const warning = toRu(result.feedback.warning);
  const firstSuggestion = toRu(result.feedback.suggestions?.[0]);
  const feedback = warning ?? firstSuggestion ?? DEFAULT_WEAK_FEEDBACK;

  return { score, isStrongEnough, feedback };
}
