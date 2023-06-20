import cookie from 'react-cookies';

import { xsrfCookieName } from '@sorare/core/src/lib/http';

export const AuthenticityToken = () => {
  return (
    <input
      type="hidden"
      name="authenticity_token"
      value={cookie.load(xsrfCookieName)}
    />
  );
};

export default AuthenticityToken;
