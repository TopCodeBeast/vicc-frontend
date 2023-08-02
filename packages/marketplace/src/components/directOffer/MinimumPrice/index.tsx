import { TypedDocumentNode, gql } from '@apollo/client';
import { faCog } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';

import Block from '@sorare/core/src/atoms/layout/Block';
import { Caption } from '@sorare/core/src/atoms/typography';
import useAmountWithConversion from '@sorare/core/src/hooks/useAmountWithConversion';
import useTokenBelongsToUser from '@sorare/core/src/hooks/useTokenBelongsToUser';
import {
  MonetaryAmountParams,
  monetaryAmountFragment,
} from '@sorare/core/src/lib/monetaryAmount';

import SetupMinimumPriceDialog from '@marketplace/components/offer/SetupMinimumPriceDialog';

import { MinimumPrice_token } from './__generated__/index.graphql';

interface Props {
  token: MinimumPrice_token;
}

const messages = defineMessages({
  setupMinPrice: {
    id: 'MinPrice.setupMinPrice',
    defaultMessage: 'Setup a minimum price',
  },
  currentMinPrice: {
    id: 'MinPrice.currentUserSingleBuyOfferMinPrice',
    defaultMessage: 'Minimum price for offer set to',
  },
});

const Line = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--half-unit);
`;

const Main = styled(Caption)`
  font-weight: var(--t-bold);
`;

const Exponent = styled(Caption)`
  color: var(--c-neutral-600);
  display: inline;
`;

const MinPriceAmount = ({ minPrice }: { minPrice: MonetaryAmountParams }) => {
  const { main, exponent } = useAmountWithConversion({
    monetaryAmount: minPrice,
  });
  return (
    <Line>
      {main && <Main>{main}</Main>}
      {exponent && <Exponent>{exponent}</Exponent>}
    </Line>
  );
};

const Left = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const Icon = styled(FontAwesomeIcon)`
  width: 12px;
  color: var(--c-green-600);
  margin-right: 5px;
`;
const Message = styled.div`
  color: var(--c-neutral-1000);
  margin-right: 5px;
  font: var(--t-12);
`;

export const MinimumPrice = ({ token }: Props) => {
  const { formatMessage } = useIntl();
  const [open, setOpen] = useState(false);
  const belongsToUser = useTokenBelongsToUser();

  const { myMintedSingleSaleOffer, privateMinPrices, publicMinPrices } = token;

  if (!belongsToUser(token) || myMintedSingleSaleOffer) {
    return null;
  }

  const onClick = () => setOpen(true);

  const minPrice = privateMinPrices || publicMinPrices;

  return (
    <>
      <Block compact inline>
        <Left onClick={onClick} onKeyDown={onClick} role="button" tabIndex={0}>
          <Icon icon={faCog} />
          {minPrice ? (
            <Left>
              <Message>{formatMessage(messages.currentMinPrice)}</Message>
              <MinPriceAmount minPrice={minPrice} />
            </Left>
          ) : (
            <Message>{formatMessage(messages.setupMinPrice)}</Message>
          )}
        </Left>
      </Block>
      {open && (
        <SetupMinimumPriceDialog
          open={open}
          onClose={() => setOpen(false)}
          title={formatMessage(messages.setupMinPrice)}
          token={token}
        />
      )}
    </>
  );
};

MinimumPrice.fragments = {
  token: gql`
    fragment MinimumPrice_token on Token {
      assetId
      slug
      ...SetupMinimumPriceDialog_token
      owner {
        id
        user {
          slug
        }
      }
      myMintedSingleSaleOffer {
        id
      }
      privateMinPrices {
        ...MonetaryAmountFragment_monetaryAmount
      }
      publicMinPrices {
        ...MonetaryAmountFragment_monetaryAmount
      }
      ...useTokenBelongsToUser_token
    }
    ${monetaryAmountFragment}
    ${useTokenBelongsToUser.fragments.token}
    ${SetupMinimumPriceDialog.fragments.token}
  ` as TypedDocumentNode<MinimumPrice_token>,
};

export default MinimumPrice;
