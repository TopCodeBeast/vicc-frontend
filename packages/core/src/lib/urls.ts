import { Location } from 'react-router-dom';

export const isAbsolute = (url: string) => {
  try {
    // https://developer.mozilla.org/en-US/docs/Web/API/URL/URL
    // This will throw a typeerror if url is not an absolute url
    return Boolean(new URL(url));
  } catch (_) {
    return false;
  }
};

export const isExternalDomain = (href: string): boolean => {
  if (!isAbsolute(href)) return false;
  const url = new URL(href);
  const internal =
    /^(www\.)?sorare.(com|dev|tech)$/.test(url.hostname) ||
    url.hostname === 'localhost';
  return !internal;
};

export const toRelative = (href: string): string => {
  if (!isAbsolute(href) || isExternalDomain(href)) return href;
  const url = new URL(href);
  return url.pathname + url.search;
};

export const matchLocation = (to: string, location: Location) =>
  to === `${location.pathname}${location.search}`;
