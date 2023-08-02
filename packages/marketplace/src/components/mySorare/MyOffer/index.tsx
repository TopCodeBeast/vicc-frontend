import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage, defineMessages } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import {
  MY_SORARE_OFFERS_RECEIVED,
  MY_SORARE_OFFERS_SENT,
} from '@sorare/core/src/constants/routes';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';

import MyPage from '@marketplace/components/mySorare/MyPage';
import DirectOffer from '@marketplace/components/mySorare/common/DirectOffer';

import { MySorarePage } from '../common/pages';
import { OfferQuery, OfferQueryVariables } from './__generated__/index.graphql';

const messages = defineMessages({
  viewOffersReceived: {
    id: 'MySorare.MyOffer.viewOffersReceived',
    defaultMessage: 'View offers received',
  },
  viewOffersSent: {
    id: 'MySorare.MyOffer.viewOffersSent',
    defaultMessage: 'View offers sent',
  },
});

const OFFER_QUERY = gql`
  query OfferQuery($id: String!) {
    tokens {
      offer(id: $id) {
        id
        ...MySorareDirectOffer_tokenOffer
      }
    }
  }
  ${DirectOffer.fragments.tokenOffer}
` as TypedDocumentNode<OfferQuery, OfferQueryVariables>;

const StyledButton = styled(Button).attrs({
  medium: true,
  color: 'blue',
})`
  display: block;
  margin: var(--double-unit) auto;
`;

export const MyOffer = ({
  page,
}: {
  page: MySorarePage.OFFERS_RECEIVED | MySorarePage.OFFERS_SENT;
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: offerData, loading } = useQuery(OFFER_QUERY, {
    variables: {
      id: id || '',
    },
    skip: !id,
  });

  const offer = offerData?.tokens?.offer;
  const isSender = page === MySorarePage.OFFERS_SENT;

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!offer) {
    return null;
  }

  return (
    <MyPage page={page}>
      <DirectOffer offer={offer} />
      {isSender ? (
        <StyledButton onClick={() => navigate(MY_SORARE_OFFERS_SENT)}>
          <FormattedMessage {...messages.viewOffersSent} />
        </StyledButton>
      ) : (
        <StyledButton onClick={() => navigate(MY_SORARE_OFFERS_RECEIVED)}>
          <FormattedMessage {...messages.viewOffersReceived} />
        </StyledButton>
      )}
    </MyPage>
  );
};
