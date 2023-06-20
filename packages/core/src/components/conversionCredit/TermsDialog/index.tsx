import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import Dialog from '@sorare/core/src/atoms/layout/Dialog';
import { Title6 } from '@sorare/core/src/atoms/typography';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { glossary } from '@sorare/core/src/lib/glossary';
import TextDocument from '@sorare/core/src/routing/TextDocument';

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
