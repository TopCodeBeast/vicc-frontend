import {
  FetchResult,
  TypedDocumentNode,
  gql,
  useMutation,
} from '@apollo/client';
import type { ResultOf } from '@graphql-typed-document-node/core';
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import {
  SignupPlatform,
  ViccPrivateKeyAttributes,
} from '__generated__/globalTypes';
import { getValue } from '@core/components/PersistsQueryStringParameters/storage';
import { useConfigContext } from '@core/contexts/config';
import { useConnectionContext } from '@core/contexts/connection';
import { currentUser } from '@core/contexts/currentUser/queries';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import useAfterLoggedInTarget from '@core/hooks/useAfterLoggedInTarget';
import useFeatureFlags from '@core/hooks/useFeatureFlags';
import usePrevious from '@core/hooks/usePrevious';
import { useRedirectUrl } from '@core/hooks/useRedirectUrl';
import { SESSION_STORAGE, useSessionStorage } from '@core/hooks/useSessionStorage';
import useUtmParams from '@core/hooks/useUtmParams';
import { getInteractionContext } from '@core/lib/events';
import useEvents from '@core/lib/events/useEvents';
import { getClientId } from '@core/lib/ga';
import { formatGqlErrors } from '@core/lib/gql';
import { SubmitSignUpForm } from '@core/protos/events/platform/web/events';

import {
  SignUpMutation,
  SignUpMutationVariables,
  SignUpMutationWithUser,
  SignUpMutationWithUserVariables,
} from './__generated__/useSignUp.graphql';

const SIGN_UP_MUTATION = gql`
  mutation SignUpMutation($input: signUpInput!) {
    signUp(input: $input) {
      currentUser {
        slug
        nickname
      }
      errors {
        path
        message
        code
      }
    }
  }
` as TypedDocumentNode<SignUpMutation, SignUpMutationVariables>;
const SIGN_UP_MUTATION_WITH_USER = gql`
  mutation SignUpMutationWithUser($input: signUpInput!) {
    signUp(input: $input) {
      currentUser {
        slug
        nickname
        ...CurrentUserProvider_currentUser
      }
      errors {
        path
        message
        code
      }
    }
  }
  ${currentUser}
` as TypedDocumentNode<SignUpMutationWithUser, SignUpMutationWithUserVariables>;

function useSignUp() {
  const { updateQuery } = useConfigContext();
  const location = useLocation();
  const lastLocation = usePrevious(location?.pathname);
  const {
    flags: { allowUnconfirmedAccess = false },
  } = useFeatureFlags();

  const redirectUrl = useRedirectUrl();

  const { getParams } = useUtmParams();
  const { getValue: getSignupPromo, setValue: setSignupPromo } =
    useSessionStorage(SESSION_STORAGE.signupPromo);
  const { showNotification } = useSnackNotificationContext();
  const track = useEvents();
  const [mutate] = useMutation(
    allowUnconfirmedAccess ? SIGN_UP_MUTATION_WITH_USER : SIGN_UP_MUTATION
  );
  const afterLoggedInTarget = useAfterLoggedInTarget();
  const { recaptchaRef } = useConnectionContext();

  const submit = useCallback(
    async (attributes: {
      nickname: string;
      email: string;
      passwordHash: string;
      certified: string;
      viccAddress?: string;
      viccPrivateKey?: ViccPrivateKeyAttributes;
      viccPrivateKeyBackup?: string;
      agreedToReceiveOffersFromPartners: boolean;
      acceptTerms: boolean;
      acceptAgeLimit: boolean;
      acceptPrivacyPolicy: boolean;
      acceptGameRules: boolean;
      signupPlatform: SignupPlatform;
      wallet: SignUpMutationVariables['input']['wallet'];
    }): Promise<FetchResult<SignUpMutation>> => {
      const { passwordHash, ...rest } = attributes;

      recaptchaRef.current?.reset();
      const recaptchaTokenV2 = await recaptchaRef.current?.executeAsync();
      if (!recaptchaTokenV2) {
        track('Invalid Signup reCAPTCHA V2');
        return {};
      }

      const result = await mutate({
        errorPolicy: 'all', // do not raise but rather forward errors through `result.errors`
        variables: {
          input: {
            ...rest,
            password: passwordHash,
            referrer: getValue('referrer'),
            impactClickId: getValue('irclickid'),
            utmParams: getParams,
            fromPath: redirectUrl || lastLocation || afterLoggedInTarget,
            gaClientId: getClientId(),
            recaptchaTokenV2,
            promoCode: getSignupPromo()?.campaignCode,
          },
        },
      });

      const errors = result.data?.signUp?.errors || [];
      if (errors.length) {
        showNotification('errors', { errors: formatGqlErrors(errors) });
        return result;
      }

      if (result.errors?.find(e => e.message === 'Invalid recaptcha token')) {
        track('Submit invalid signup reCAPTCHA');
      }

      if (!result.errors && result.data?.signUp?.currentUser) {
        track(
          'Submit Sign Up Form',
          SubmitSignUpForm.toJSON({
            interactionContext: getInteractionContext(),
          }) as any
        );
        if (allowUnconfirmedAccess) {
          updateQuery(
            (result.data as ResultOf<typeof SIGN_UP_MUTATION_WITH_USER>).signUp!
              .currentUser!
          );
        }
        showNotification('signUp', {
          nickname: result.data!.signUp?.currentUser!.nickname,
        });
        setSignupPromo(null);
      }

      return result;
    },
    [
      recaptchaRef,
      mutate,
      getParams,
      redirectUrl,
      lastLocation,
      afterLoggedInTarget,
      getSignupPromo,
      track,
      showNotification,
      allowUnconfirmedAccess,
      setSignupPromo,
      updateQuery,
    ]
  );

  return submit;
}

export default useSignUp;
