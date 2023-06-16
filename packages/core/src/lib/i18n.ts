export function toLanguageCode(locale: string): string {
  return locale.split('-')[0];
}
