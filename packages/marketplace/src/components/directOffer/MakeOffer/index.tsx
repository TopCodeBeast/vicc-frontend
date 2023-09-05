import { TypedDocumentNode, gql } from '@apollo/client';
import { faExchangeAlt } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import { Tradeable } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useLoggedCallback from '@sorare/core/src/hooks/useLoggedCallback';
import useToggle from '@sorare/core/src/hooks/useToggle';
import useTokenBelongsToUser from '@sorare/core/src/hooks/useTokenBelongsToUser';
import { isTokenWithUser } from '@sorare/core/src/lib/cards';

import NewOfferBuilder from '@marketplace/components/directOffer/NewOfferBuilder';
import { useMarketplaceContext } from '@marketplace/contexts/Marketplace';
import useCannotBuy from '@marketplace/hooks/offers/useCannotBuy';

import { MakeOffer_token } from './__generated__/index.graphql';

type Props = {
  token: MakeOffer_token;
};

const statusMessages = defineMessages<Tradeable>({
  [Tradeable.NOT_YET]: {
    id: 'MakeOffer.not_yet',
    defaultMessage: 'This Card is not transferable yet. It will be soon!',
  },
  [Tradeable.NO]: {
    id: 'MakeOffer.no',
    defaultMessage:
      'This Card cannot be sold on Sorare. The owner must transfer it to their Sorare account.',
  },
  [Tradeable.YES]: {
    id: 'MakeOffer.internal',
    defaultMessage: 'You can make an offer on this Card.',
  },
  [Tradeable.UNDEFINED]: {
    id: 'MakeOffer.undefined',
    defaultMessage: 'This Card has no owner.',
  },
  [Tradeable.DEPOSIT_REQUIRED]: {
    id: 'MakeOffer.deposit_required',
    defaultMessage: 'You need to make a deposit',
  },
});

const messages = defineMessages({
  trade: {
    id: 'MakeOffer.trade',
    defaultMessage: 'Trade',
  },
  cta: {
    id: 'MakeOffer.submit',
    defaultMessage: 'Send',
  },
  confirmationMessage: {
    id: 'MakeOffer.confirmationMessage',
    defaultMessage: 'Offer amount',
  },
});

const Root = styled.div`
  display: flex;
`;
const StyledButton = styled(Button)`
  width: 100%;
`;
const ButtonContent = styled.span`
  display: flex;
  gap: 10px;
  align-items: center;
  & > * + * {
    margin-left: 0;
  }
`;

export const MakeOffer = ({ token }: Props) => {
  const { formatMessage } = useIntl();
  const { trackClickTrade } = useMarketplaceContext();

  const [open, toggleOpen] = useToggle(false);
  const belongsToUser = useTokenBelongsToUser();
  const cannotBuy = useCannotBuy();
  const { currentUser } = useCurrentUserContext();

  const { owner, tradeableStatus, liveSingleBuyOffers } = token;

  const onClick = useLoggedCallback(() => {
    toggleOpen();
    trackClickTrade();
  });

  if (belongsToUser(token) || !owner?.user || tradeableStatus !== Tradeable.YES)
    return null;

  if (!isTokenWithUser(token) || liveSingleBuyOffers.length > 0) return null;
  if (liveSingleBuyOffers.length > 0) return null;

  return (
    <Root>
      <Tooltip
        title={formatMessage(
          cannotBuy(token) || statusMessages[tradeableStatus]
        )}
      >
        <StyledButton
          color="white"
          onClick={onClick}
          disabled={Boolean(cannotBuy(token))}
          medium
        >
          <ButtonContent>
            <FontAwesomeIcon icon={faExchangeAlt} />
            <FormattedMessage tagName="span" {...messages.trade} />
          </ButtonContent>
        </StyledButton>
      </Tooltip>
      {open && currentUser && (
        <NewOfferBuilder
          receiveCards={[token]}
          to={owner?.user}
          onClose={toggleOpen}
          currentUser={currentUser}
        />
      )}
    </Root>
  );
};

MakeOffer.fragments = {
  token: gql`
    fragment MakeOffer_token on Token {
      assetId
      slug
      tradeableStatus
      owner {
        id
        user {
          slug
          id
          viccAddress
          nickname
          ...NewOfferBuilder_publicUserInfoInterface
        }
      }
      liveSingleSaleOffer {
        id
      }
      liveSingleBuyOffers {
        id
      }
      ...NewOfferBuilder_token
      ...useTokenBelongsToUser_token
    }
    ${NewOfferBuilder.fragments.token}
    ${NewOfferBuilder.fragments.user}
    ${useTokenBelongsToUser.fragments.token}
  ` as TypedDocumentNode<MakeOffer_token>,
};

export default MakeOffer;
