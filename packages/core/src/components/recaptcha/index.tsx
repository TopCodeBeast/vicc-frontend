import { forwardRef } from 'react';
import GoogleReCAPTCHA, { ReCAPTCHAProps } from 'react-google-recaptcha';

import useFeatureFlags from '@core/hooks/useFeatureFlags';

export const ReCAPTCHA = forwardRef<
  GoogleReCAPTCHA,
  Omit<ReCAPTCHAProps, 'sitekey'>
>((props, ref) => {
  const {
    flags: { disableRecaptchaValidationInStagingMockprod = false },
  } = useFeatureFlags();

  return (
    <GoogleReCAPTCHA
      ref={ref}
      size="invisible"
      {...props}
      sitekey={
        disableRecaptchaValidationInStagingMockprod
          ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
          : '6Lf8qBMjAAAAAOwxyhaWofwa1Pu5SIIPCRk4ICPq'
      }
    />
  );
});

ReCAPTCHA.displayName = 'ReCAPTCHA';

export { GoogleReCAPTCHA };
