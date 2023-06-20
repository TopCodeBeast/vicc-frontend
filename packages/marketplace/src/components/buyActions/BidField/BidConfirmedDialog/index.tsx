import { gql } from '@apollo/client';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import Dialog from '@sorare/core/src/atoms/layout/Dialog';
import { Text14, Title3 } from '@sorare/core/src/atoms/typography';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';

import BidResume from './BidResume';
import { BidConfirmedDialogContent_tokenAuction } from './__generated__/index.graphql';

const messages = defineMessages({
  title: {
    id: 'BidConfirmedDialogContent.title',
    defaultMessage: 'Score! You are the highest bidder.',
  },
  autoBidExplanation: {
    id: 'BidConfirmedDialogContent.autoBidExplanation',
    defaultMessage:
      'Sorare will continue to bid up on your behalf until your max bid is reached.',
  },
  buttonLabel: {
    id: 'BidConfirmedDialogContent.buttonLabel',
    defaultMessage: 'Got it!',
  },
});

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;

const Title = styled(Title3)`
  text-align: center;
`;

const CheckContainer = styled.div`
  align-self: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--c-green-600);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LeftAlignText = styled(Text14)`
  text-align: left;
`;

const CheckIcon = styled(FontAwesomeIcon)`
  color: var(--c-neutral-100);
  .dark-theme & {
    color: var(--c-neutral-200);
  }
`;

const BidConfirmedDialog = ({
  auction,
  assetsPreview,
  open,
  onClose,
}: {
  auction: BidConfirmedDialogContent_tokenAuction;
  open: boolean;
  assetsPreview?: ReactNode;
  onClose: () => void;
}) => {
  const { up: isLaptop } = useScreenSize('laptop');
  return (
    <Dialog title=" " fullScreen={!isLaptop} open={open} onClose={onClose}>
      <Content>
        <CheckContainer>
          <CheckIcon icon={faCheck} size="2x" />
        </CheckContainer>
        <Title>
          <FormattedMessage {...messages.title} />
        </Title>
        <BidResume auction={auction} />
        {auction.autoBid && (
          <LeftAlignText>
            <FormattedMessage {...messages.autoBidExplanation} />
          </LeftAlignText>
        )}
        {assetsPreview}
        <Button onClick={onClose} medium color="blue">
          <FormattedMessage {...messages.buttonLabel} />
        </Button>
      </Content>
    </Dialog>
  );
};

BidConfirmedDialog.fragments = {
  tokenAuction: gql`
    fragment BidConfirmedDialogContent_tokenAuction on TokenAuction {
      id
      autoBid
      ...BidResume_tokenAuction
    }
    ${BidResume.fragments.tokenAuction}
  `,
};

export default BidConfirmedDialog;
