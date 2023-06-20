import { gql } from '@apollo/client';
import { faExchangeAlt } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';

import { Button } from '@sorare/core/src/atoms/buttons/Button';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useToggle from '@sorare/core/src/hooks/useToggle';

import NewOfferBuilder from 'components/directOffer/NewOfferBuilder';
import { useMarketplaceContext } from '@sorare/marketplace/src/contexts/Marketplace';
import useTradeButtonVisible from 'hooks/offers/useTradeButtonVisible';

import { TradeButton_publicUserInfoInterface } from './__generated__/index.graphql';

type Props = {
  user: TradeButton_publicUserInfoInterface;
};

export const TradeButton = ({ user }: Props) => {
  const { currentUser } = useCurrentUserContext();
  const isTradeButtonVisible = useTradeButtonVisible(user.slug);
  const [offerBuilderOpen, toggleOfferBuilderOpen] = useToggle(false);

  const { trackClickTrade } = useMarketplaceContext();

  const openOfferBuilder = () => {
    toggleOfferBuilderOpen();
    trackClickTrade();
  };

  if (!isTradeButtonVisible) {
    return null;
  }
  return (
    <>
      <Button medium color="white" onClick={openOfferBuilder}>
        <FontAwesomeIcon icon={faExchangeAlt} />
        <span>
          <FormattedMessage
            id="USSportGalleryHeader.trade"
            defaultMessage="Trade"
          />
        </span>
      </Button>
      {offerBuilderOpen && currentUser && (
        <NewOfferBuilder
          onClose={toggleOfferBuilderOpen}
          to={user}
          currentUser={currentUser}
        />
      )}
    </>
  );
};

TradeButton.fragments = {
  user: gql`
    fragment TradeButton_publicUserInfoInterface on PublicUserInfoInterface {
      id
      slug
      ...NewOfferBuilder_publicUserInfoInterface
    }
    ${NewOfferBuilder.fragments.user}
  `,
};
