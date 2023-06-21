import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import Dialog from '@core/atoms/layout/Dialog';
import { Title6 } from '@core/atoms/typography';
import useScreenSize from '@core/hooks/device/useScreenSize';
import { glossary } from '@core/lib/glossary';
import TextDocument from '@core/routing/TextDocument';

type Props = {
  onClose: () => void;
};
const Content = styled.div`
  width: 100%;
  margin: 0 calc(-1 * var(--unit));
`;

export const TermsDialog = ({ onClose }: Props) => {
  const { formatMessage } = useIntl();
  const { up: isLaptop } = useScreenSize('laptop');
  return (
    <Dialog
      open
      onClose={onClose}
      title={<Title6 />}
      fullScreen={!isLaptop}
      shadowFooter
      footer={
        <Button fullWidth medium color="black" onClick={onClose}>
          <FormattedMessage {...glossary.ok} />
        </Button>
      }
    >
      <Content dir="ltr">
        <TextDocument
          document={formatMessage({
            id: 'ConversionCredit.TermsDialog.path',
            defaultMessage: 'DISCOUNT_CREDIT_TERMS.md',
          })}
        />
      </Content>
    </Dialog>
  );
};
