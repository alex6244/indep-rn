export function normalizePhone(input: string): string {
  // Оставляем только цифры
  let digits = input.replace(/\D/g, "");

  // Отбрасываем ведущий 7/8 как код страны
  if (digits.startsWith("7") || digits.startsWith("8")) {
    digits = digits.slice(1);
  }

  // Оставляем максимум 10 цифр (локальная часть)
  digits = digits.slice(0, 10);

  if (digits.length !== 10) {
    // Невалидный номер для нашего формата
    return "";
  }

  return `+7${digits}`;
}

