import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';

import { Text16 } from '@sorare/core/src/atoms/typography';

import LiveOffer from '@football/components/card/CardPage/LiveOffer';

import { MyOffers_token } from './__generated__/index.graphql';

interface Props {
  token: MyOffers_token;
}

export const MyOffers = ({ token }: Props) => {
  if (token.liveSingleBuyOffers.length === 0) return null;

  return (
    <div>
      <Text16 bold>
        <FormattedMessage id="MyOffers.title" defaultMessage="My Offers" />
      </Text16>
      {token.liveSingleBuyOffers.map(o => (
        <LiveOffer key={o.id} offer={o} />
      ))}
    </div>
  );
};

MyOffers.fragments = {
  token: gql`
    fragment MyOffers_token on Token {
      slug
      assetId
      id
      liveSingleBuyOffers {
        id
        ...LiveOffer_tokenOffer
      }
    }
    ${LiveOffer.fragments.tokenOffer}
  ` as TypedDocumentNode<MyOffers_token>,
};

export default MyOffers;
