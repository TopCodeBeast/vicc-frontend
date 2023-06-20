import isMobileWeb from 'is-mobile';
import { useContext, useEffect, useState } from 'react';

import { MessagingContext, SignUp } from '@sorare/wallet-shared';
import { SignupPlatform } from '__generated__/globalTypes';
import { AcceptTermsInfo, useConnectionContext } from '@sorare/core/src/contexts/connection';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useSignUp from '@sorare/core/src/hooks/auth/useSignUp';

const readAcceptanceTerms = (
  args: SignUp['request']['args']
): AcceptTermsInfo | undefined => {
  if (args.version === '2') {
    return {
      acceptTerms: args.acceptTerms,
      acceptAgeLimit: args.acceptAgeLimit,
      acceptPrivacyPolicy: args.acceptPrivacyPolicy,
      agreedToReceiveOffersFromPartners: args.agreedToReceiveOffersFromPartners,
      acceptGameRules: true,
    };
  }
  return undefined;
};

export default () => {
  const { registerHandler } = useContext(MessagingContext)!;
  const signUp = useSignUp();
  const [acceptedTerms, setAcceptedTerms] = useState<AcceptTermsInfo | null>(
    null
  );
  const { refetch } = useCurrentUserContext();
  const { promptTerms, closeConnectionDialog } = useConnectionContext()!;

  useEffect(
    () =>
      registerHandler<SignUp>('signUp', async args => {
        const { version, mobile, ...rest } = args;

        // Terms and Conditions Modal
        const acceptTerms =
          acceptedTerms ||
          readAcceptanceTerms(args) ||
          (await new Promise<AcceptTermsInfo>((resolve, reject) => {
            return promptTerms(
              {
                closable: false,
                withoutAcceptTermsMutation: true,
              },
              { resolve, reject }
            );
          }));

        setAcceptedTerms(acceptTerms);

        let signupPlatform: SignupPlatform = SignupPlatform.WEB;
        if (mobile) signupPlatform = SignupPlatform.MOBILE;
        else if (isMobileWeb()) signupPlatform = SignupPlatform.MOBILE_WEB;

        const { data } = await signUp({
          ...rest,
          signupPlatform,
          certified: 'certified',
          ...acceptTerms,
        });

        if (data!.signUp) {
          const { errors } = data!.signUp;
          if (errors && errors.length !== 0) {
            return {
              error: errors.reduce<Record<string, string>>((sum, err) => {
                if (err.path?.length !== 2) return sum;
                sum[err.path[1]] = err.message;
                return sum;
              }, {}),
            };
          }
          refetch();
        }
        setAcceptedTerms(null);
        closeConnectionDialog(rest.email);
        return { error: {} };
      }),
    [
      registerHandler,
      signUp,
      refetch,
      promptTerms,
      acceptedTerms,
      closeConnectionDialog,
    ]
  );
};
