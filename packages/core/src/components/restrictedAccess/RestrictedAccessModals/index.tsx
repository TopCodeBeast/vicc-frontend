// import VerifyPhoneNumber from '@core/components/user/VerifyPhoneNumber';
import { useCurrentUserContext } from '@core/contexts/currentUser';
import { useRestrictedAccessContext } from '@core/contexts/restrictedAccess';
import EmailVerificationDialog from '@core/contexts/restrictedAccess/EmailVerificationDialog';
import useFeatureFlags from '@core/hooks/useFeatureFlags';

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
      <>VerifyPhoneNumber123</>
      // <VerifyPhoneNumber onCancel={() => setShowRestrictedAccess(undefined)} />
    );

  return null;
};

export default RestrictedAccessModals;
