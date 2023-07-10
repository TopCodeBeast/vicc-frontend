import qs from 'qs';
import { useCallback, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { MessagingContext, PromptResetPassword } from '@sorare/wallet-shared';

export default () => {
  const { sendRequest } = useContext(MessagingContext)!;
  const location = useLocation();

  const {
    email,
    nickname,
    reset_password_token: token,
  } = useMemo(() => qs.parse(location.search.slice(1)), [location.search]);

  return useCallback(async () => {
    if (email && nickname && token) {
      await sendRequest<PromptResetPassword>('promptResetPassword', {
        email: email.toString(),
        nickname: nickname.toString(),
        resetPasswordToken: token.toString(),
      });
    }
  }, [email, nickname, sendRequest, token]);
};
