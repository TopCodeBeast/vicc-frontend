import { COOKIE_POLICY } from '@core/constants/routes';

const LinkToCookiePolicy = (s: string) => {
  return <a href={COOKIE_POLICY}>{s}</a>;
};

export default LinkToCookiePolicy;
