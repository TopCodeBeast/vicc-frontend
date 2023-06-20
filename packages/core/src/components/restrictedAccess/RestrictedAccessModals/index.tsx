import VerifyPhoneNumber from 'components/user/VerifyPhoneNumber';
import { useCurrentUserContext } from 'contexts/currentUser';
import { useRestrictedAccessContext } from 'contexts/restrictedAccess';
import EmailVerificationDialog from 'contexts/restrictedAccess/EmailVerificationDialog';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';

export const RestrictedAccessModals = () => {
  const {
    flags: { useForceEmailVerificationAfterSignup = false },
  } = useFeatureFlags();
  const { currentUser } = useCurrentUserContext();
  const forceVerifyEmail =
    useForceEmailVerificationAfterSignup &&
    currentUser &&
    !currentUser.confirmed;
  const { showRestrictedAccess, setShowRestrictedAccess } =
    useRestrictedAccessContext();

  if (forceVerifyEmail || showRestrictedAccess === 'email')
    return (
      <EmailVerificationDialog
        closable={!forceVerifyEmail}
        onClose={() => setShowRestrictedAccess(undefined)}
      />
    );
  if (showRestrictedAccess === 'phone')
    return (
      <VerifyPhoneNumber onCancel={() => setShowRestrictedAccess(undefined)} />
    );

  return null;
};

export default RestrictedAccessModals;
