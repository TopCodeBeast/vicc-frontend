import qs from 'qs';
import { forwardRef } from 'react';
import styled from 'styled-components';

import { getValue } from '@core/components/PersistsQueryStringParameters/storage';
import { API_ROOT } from '@core/config';
import useAfterLoggedInTarget from '@core/hooks/useAfterLoggedInTarget';
import useQueryString from '@core/hooks/useQueryString';

import AuthenticityToken from '../../form/AuthenticityToken';
import { Props } from './types';

const Form = styled.form`
  margin-bottom: 0;
`;

export const OAuthForm = forwardRef<HTMLFormElement, Props>((props, ref) => {
  const { provider, children } = props;
  const action = useQueryString('action');
  const afterLoggedInTarget = useAfterLoggedInTarget();
  const querystring = qs.stringify(
    {
      referrer: getValue('referrer'),
      impact_click_id: getValue('irclickid'),
      invitation_token: getValue('invitation_token'),
      after_logged_in_target:
        afterLoggedInTarget ||
        qs.stringify({ action }, { skipNulls: true, addQueryPrefix: true }),
    },
    { skipNulls: true }
  );

  return (
    <Form
      ref={ref}
      action={`${API_ROOT}/users/auth/${provider}?${querystring}`}
      method="post"
    >
      <AuthenticityToken />
      {children}
    </Form>
  );
});

OAuthForm.displayName = 'OAuthForm';

export default OAuthForm;
