import { useMutation } from '@apollo/client';
import { secondsToHours } from 'date-fns';
import { useCallback } from 'react';

import Bold from '@core/atoms/typography/Bold';
import { getValue } from '@core/components/PersistsQueryStringParameters/storage';
import { useDeviceFingerprintContext } from '@core/contexts/deviceFingerprint';
import { useRestrictedAccessContext } from '@core/contexts/restrictedAccess';
import createResendEmailConfirmationButton from '@core/contexts/restrictedAccess/ResendEmailConfirmationLink';
import { useSnackNotificationContext } from '@core/contexts/snackNotification';
import useEvents from '@core/lib/events/useEvents';
import { getClientId } from '@core/lib/ga';

import { SignInArgs } from '.';
import { SignInMutation } from './__generated__/queries.graphql';
import { SIGN_IN_MUTATION } from './queries';
import { CurrentUserQuery_currentUser } from './types';

type SignInMutation_signIn = NonNullable<SignInMutation['signIn']>;

export default (): [
  (args: SignInArgs) => Promise<SignInMutation_signIn | null | undefined>,
  CurrentUserQuery_currentUser | undefined | null
] => {
  const { showNotification } = useSnackNotificationContext();
  const track = useEvents();
  const { setShowRestrictedAccess } = useRestrictedAccessContext();
  const [signIn, { data }] = useMutation(SIGN_IN_MUTATION);
  const { deviceFingerprint: getDeviceFingerPrint } =
    useDeviceFingerprintContext();
  return [
    useCallback(
      async ({
        email,
        passwordHash,
        otpAttempt,
        otpSessionChallenge,
      }: SignInArgs): Promise<SignInMutation_signIn | null | undefined> => {
        const deviceFingerprint = await getDeviceFingerPrint();

        const result = await signIn({
          variables: {
            input: {
              email,
              password: passwordHash,
              otpAttempt,
              otpSessionChallenge,
              gaClientId: getClientId(),
              deviceFingerprint,
              // impactClickId: getValue('irclickid'),
            },
          },
        });

        const currentUser = result.data?.signIn?.currentUser;

        if (currentUser && !currentUser.confirmed) {
          const remainingHours = secondsToHours(
            Math.max(currentUser.timeLeftForConfirmation || 0, 0)
          );
          showNotification(
            'confirmEmail',
            {
              strong: Bold,
              remainingHours,
              link: createResendEmailConfirmationButton({
                onClick: () => setShowRestrictedAccess('email'),
              }),
            },
            { autoHideDuration: 30000 }
          );
          track('View Email Confirmation Reminder Toast');
        }

        return result.data?.signIn;
      },
      [
        getDeviceFingerPrint,
        signIn,
        track,
        showNotification,
        setShowRestrictedAccess,
      ]
    ),
    data?.signIn?.currentUser,
  ];
};
