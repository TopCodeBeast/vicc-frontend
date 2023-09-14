import { useApolloClient } from '@apollo/client';
import { ReactElement, useCallback } from 'react';

import { useCurrentUserContext } from '@core/contexts/currentUser';
import useAfterLoggedInTarget from '@core/hooks/useAfterLoggedInTarget';
import { client as httpClient, onError } from '@core/lib/http';
import { paramsToSnakeCase } from '@core/lib/toSnakeCase';

import AuthContextProvider, { UpdateUserAttributes } from '.';
import useChangePassword from './useChangePassword';

interface Props {
  children: ReactElement;
}

export const AuthProvider = ({ children }: Props) => {
  const { refetch } = useCurrentUserContext();
  const client = useApolloClient();
  const fromPath = useAfterLoggedInTarget();
  const changePasswordMutation = useChangePassword();

  const refreshCurrentUser = async () => client.resetStore();

  const changePassword = useCallback(
    async (attributes: UpdateUserAttributes) => {
      const { passwordHash, currentPasswordHash } = attributes;
      try {
        const result = await changePasswordMutation({
          password: currentPasswordHash,
          newPassword: passwordHash,
        });
        refetch();
        return result;
      } catch (error) {
        return onError(error);
      }
    },
    [refetch]
  );

  const updateUser = useCallback(
    async (attributes: UpdateUserAttributes) => {
      const { passwordHash, currentPasswordHash, ...rest } = attributes;
      const params: UpdateUserAttributes & {
        currentPassword?: string;
        password?: string;
      } = rest;
      if (passwordHash) {
        params.password = passwordHash;
        params.currentPassword = passwordHash;
      }
      if (currentPasswordHash) params.currentPassword = currentPasswordHash;

      try {
        const result = await httpClient.put('/users.json', {
          user: paramsToSnakeCase(params as any),
        });
        refetch();
        return result;
      } catch (error) {
        return onError(error);
      }
    },
    [refetch]
  );

  const confirmDevice = async (confirmationToken: string) => {
    try {
      const response = await httpClient.get(
        `/device_confirmations/${confirmationToken}`
      );
      if (response.status === 200) {
        await refreshCurrentUser();
      }

      return response;
    } catch (error) {
      return onError(error);
    }
  };

  const createResetPasswordRequest = useCallback(
    async (email: string, recaptchaToken: string) => {
      try {
        const result = await httpClient.post('/users/password.json', {
          user: {
            email,
            from_path: fromPath,
            recaptcha_token_v2: recaptchaToken,
          },
        });
        return result;
      } catch (error) {
        return onError(error);
      }
    },
    [fromPath]
  );

  const resetPassword = useCallback(
    async (passwordHash: string, token: string) => {
      try {
        return await httpClient.put('/users/password.json', {
          user: {
            reset_password_token: token,
            password: passwordHash,
            password_confirmation: passwordHash,
          },
        });
      } catch (error) {
        return onError(error);
      }
    },
    []
  );

  return (
    <AuthContextProvider
      value={{
        updateUser,
        changePassword,
        confirmDevice,
        refreshCurrentUser,
        createResetPasswordRequest,
        resetPassword,
      }}
    >
      {children}
    </AuthContextProvider>
  );
};

export default AuthProvider;
