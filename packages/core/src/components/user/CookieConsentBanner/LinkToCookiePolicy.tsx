import { COOKIE_POLICY } from '@sorare/core/src/constants/routes';

const LinkToCookiePolicy = (s: string) => {
  return <a href={COOKIE_POLICY}>{s}</a>;
};

export default LinkToCookiePolicy;
