import { faLock } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import LoadingButton from '@core/atoms/buttons/LoadingButton';

const messages = defineMessages({
  soldOut: {
    id: 'ItemPreviewDialog.SizeSelector.Cta.soldOut',
    defaultMessage: 'Sold out',
  },
  buy: {
    id: 'ItemPreviewDialog.SizeSelector.Cta.buy',
    defaultMessage: 'Buy this item',
  },
});

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

type Props = {
  onClick: () => void;
  disabled?: boolean;
  soldOut?: boolean;
  loading?: boolean;
  locked?: boolean;
};

export const ClubShopItemBuyButton = ({
  onClick,
  disabled,
  loading,
  soldOut,
  locked,
}: Props) => {
  return (
    <LoadingButton
      color="blue"
      onClick={onClick}
      disabled={locked || soldOut || disabled}
      loading={!!loading}
      medium
    >
      <FlexContainer>
        {locked && <FontAwesomeIcon icon={faLock} />}
        <FormattedMessage {...(soldOut ? messages.soldOut : messages.buy)} />
      </FlexContainer>
    </LoadingButton>
  );
};
