import TwoFactAuthDialog from 'components/TwoFactAuth/TwoFactAuthDialog';
import { GraphQLResult } from 'components/form/Form';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';

import { Prompt2faCallback, useConnectionContext } from '..';

type Props = {
  open: boolean;
  otpSessionChallenge: string;
  onSignedIn: Prompt2faCallback | null;
  onClose: () => void;
  reason?: string;
};

export const PromptTwoFactAuthDialog = ({
  open,
  otpSessionChallenge,
  onSignedIn,
  onClose,
  reason,
}: Props) => {
  const { signIn } = useCurrentUserContext();

  const { promptTerms } = useConnectionContext();

  const doSignIn = async (
    values: any,
    onResult: (result: GraphQLResult) => void
  ) => {
    const { otpAttempt } = values;

    const response = await signIn({ otpAttempt, otpSessionChallenge });

    onResult(response!);
  };

  const onSuccess = (result: GraphQLResult) => {
    if (onSignedIn) onSignedIn.resolve((result as any).currentUser);
  };

  const onCancel = () => {
    if (onSignedIn) onSignedIn.reject('No 2FA');
  };

  const onError = (result: GraphQLResult & { tcuToken?: string }) => {
    if (
      result?.errors
        ?.map(({ message }) => message)
        .includes('must_accept_tcus') ||
      result?.error === 'must_accept_tcus'
    ) {
      onClose();
      if (onSignedIn) onSignedIn.reject('has_accepted_tcus_after_2FA');
      promptTerms({
        closable: false,
        tcuToken: result.tcuToken,
      });
    }
  };

  return (
    <TwoFactAuthDialog
      open={open}
      reason={reason}
      onSubmit={(values: any, onResult: (result: GraphQLResult) => void) => {
        doSignIn(values, onResult);
      }}
      onSuccess={onSuccess}
      onClose={onClose}
      onError={onError}
      onCancel={onCancel}
    />
  );
};

export default PromptTwoFactAuthDialog;
