const PATTERN = /^(?<content>(.+))\s+(?<lastWord>[^\s]+)$/;
export const UNBREAKABLE_SPACE = '\u00A0';
export const avoidOrphan = (text: string) => {
  return text.replace(PATTERN, `$<content>${UNBREAKABLE_SPACE}$<lastWord>`);
};
