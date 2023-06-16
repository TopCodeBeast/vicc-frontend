export default () => {
  const lang =
    typeof navigator !== 'undefined'
      ? navigator.languages?.[0] || navigator.language
      : '';

  // Safari wrongly returns lang in lowercase: https://bugs.webkit.org/show_bug.cgi?id=163096
  if (lang.match(/[a-z]{2}-[a-z]{2}/)) {
    const [l1, l2] = lang.split('-');
    return `${l1}-${l2.toUpperCase()}`;
  }

  return lang;
};
