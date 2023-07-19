import { gql } from '@apollo/client';
import classNames from 'classnames';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@sorare/core/src/atoms/buttons/Button';
import { Caption, Text14 } from '@sorare/core/src/atoms/typography';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useTokenOfferBelongsToUser from '@sorare/core/src/hooks/useTokenOfferBelongsToUser';
import useEvents from '@sorare/core/src/lib/events/useEvents';

import { TokenDetailsInfos, TokenDetailsRoot } from '@marketplace/components/ItemPreview/ui';
import NewSaleDialog from '@marketplace/components/offer/NewSaleDialog';

import { SalePrice } from '../SalePrice';
import { SaleWinner } from '../SaleWinner';
import {
  EndedSaleDetails_offer,
  EndedSaleDetails_token,
} from './__generated__/index.graphql';

type Props = {
  sale: EndedSaleDetails_offer;
  token: EndedSaleDetails_token;
  allowColumnLayout?: boolean;
};

export const EndedSaleDetails = ({ sale, token, allowColumnLayout }: Props) => {
  const [open, setOpen] = useState(false);
  const { currentUser } = useCurrentUserContext();
  const belongsToUser = useTokenOfferBelongsToUser();
  const track = useEvents();

  const ownsToken = currentUser?.slug === token?.owner?.user?.slug;
  const offerExpired = sale.status === 'ended';
  const relistedToken =
    token.myMintedSingleSaleOffer &&
    belongsToUser(token.myMintedSingleSaleOffer);

  const onClickListAgain = () => {
    setOpen(true);
    track('Click List Again', { cardSlug: token.slug });
  };

  return (
    <TokenDetailsRoot className={classNames({ allowColumnLayout })}>
      <TokenDetailsInfos>
        <SalePrice sale={sale} showFees={!!sale.acceptedAt} />
        {offerExpired ? (
          <Caption color="var(--c-neutral-600)">
            <FormattedMessage
              id="MySorare.PastSaleOfferItem.Expired"
              defaultMessage="Expired"
            />
          </Caption>
        ) : (
          <SaleWinner sale={sale} />
        )}
      </TokenDetailsInfos>
      {ownsToken && offerExpired && (
        <div>
          {relistedToken ? (
            <Text14 color="var(--c-neutral-600)">
              <FormattedMessage
                id="MySorare.PastSaleOfferItem.Relisted"
                defaultMessage="Currently re-listed"
              />
            </Text14>
          ) : (
            <>
              <Button small stroke color="blue" onClick={onClickListAgain}>
                <FormattedMessage
                  id="MySorare.PastSaleOfferItem.ListAgain"
                  defaultMessage="List Again"
                />
              </Button>
              {open && (
                <NewSaleDialog
                  open
                  onClose={() => setOpen(false)}
                  token={token}
                  initialWeiAmount={sale.priceWei}
                />
              )}
            </>
          )}
        </div>
      )}
    </TokenDetailsRoot>
  );
};

EndedSaleDetails.fragments = {
  token: gql`
    fragment EndedSaleDetails_token on Token {
      assetId
      slug
      owner {
        id
        user {
          slug
        }
      }
      myMintedSingleSaleOffer {
        id
        ...useTokenOfferBelongsToUser_offer
      }
      ...NewSaleDialog_token
    }
    ${useTokenOfferBelongsToUser.fragments.offer}
    ${NewSaleDialog.fragments.token}
  `,
  offer: gql`
    fragment EndedSaleDetails_offer on TokenOffer {
      id
      endDate
      status
      cancelledAt
      priceWei: price
      priceFiat: priceInFiat {
        eur
        usd
        gbp
      }
      owners {
        id
        priceWei: price
        priceFiat: priceInFiat {
          eur
          usd
          gbp
        }
      }
      marketFeeAmountWei: marketFeeAmount
      marketFeeAmountFiat: marketFeeAmountInFiat {
        eur
        usd
        gbp
      }
      acceptedAt
      sender {
        ... on User {
          slug
        }
      }
      ...SaleWinner_offer
      ...SalePrice_offer
      ...LiveSaleDetails_offer
      ...useTokenOfferBelongsToUser_offer
    }
    ${useTokenOfferBelongsToUser.fragments.offer}
    ${SaleWinner.fragments.offer}
    ${SalePrice.fragments.offer}
  `,
};
