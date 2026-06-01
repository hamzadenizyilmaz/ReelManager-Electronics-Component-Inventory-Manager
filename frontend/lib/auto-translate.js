export function smartTranslate(value) {
  return String(value || "");
}

export function autoFillTranslations(form) {
  return { ...form };
}
