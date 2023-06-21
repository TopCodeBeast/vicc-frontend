import { useState } from 'react';
import { FormattedMessage, defineMessage } from 'react-intl';

import Button from '@core/atoms/buttons/Button';
import Dialog from '@core/atoms/layout/Dialog';
import { Title5 } from '@core/atoms/typography';
import useScreenSize from '@core/hooks/device/useScreenSize';
import { glossary } from '@core/lib/glossary';

import Enable2FAForm from './Enable2FAForm';

const message = defineMessage({
  id: 'Settings.enable2FA.cta',
  defaultMessage: 'Enable device',
});

export const Enable2FA = ({
  onEnabling2FA,
}: {
  onEnabling2FA: (codes: string[]) => void;
}) => {
  const [enable2FADialog, setEnable2FADialog] = useState(false);
  const { up: isTablet } = useScreenSize('tablet');
  return (
    <div>
      <Button small onClick={() => setEnable2FADialog(true)} color="blue">
        <FormattedMessage {...message} />
      </Button>
      <Dialog
        open={enable2FADialog}
        onClose={() => setEnable2FADialog(false)}
        title={
          <Title5>
            <FormattedMessage {...glossary.twofa} />
          </Title5>
        }
        fullScreen={!isTablet}
      >
        <Enable2FAForm onEnabling2FA={onEnabling2FA} />
      </Dialog>
    </div>
  );
};

export default Enable2FA;
