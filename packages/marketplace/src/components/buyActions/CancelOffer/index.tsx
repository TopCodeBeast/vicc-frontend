import { gql } from '@apollo/client';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Color } from '@sorare/core/src/atoms/buttons/Button';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import useTokenOfferBelongsToUser from '@sorare/core/src/hooks/useTokenOfferBelongsToUser';

import useCancelOffer from '@sorare/marketplace/src/hooks/offers/useCancelOffer';

import { CancelOffer_token } from './__generated__/index.graphql';

interface Props {
  token: CancelOffer_token;
  medium?: boolean;
  small?: boolean;
  stroke?: boolean;
  color?: Color;
}

const Root = styled(LoadingButton)`
  flex-shrink: 0;
  width: 100%;
`;

const CancelOffer = ({
  token: { myMintedSingleSaleOffer: offer },
  medium = false,
  small = false,
  color = 'red',
  stroke = true,
}: Props) => {
  const { showNotification } = useSnackNotificationContext();
  const [processing, setProcessing] = useState(false);
  const belongsToUser = useTokenOfferBelongsToUser();
  const cancelOffer = useCancelOffer();

  const { blockchainId } = offer!;

  const handleClick = async () => {
    setProcessing(true);
    const error = await cancelOffer(blockchainId!);
    if (!error) showNotification('cancelOffer');
    setProcessing(false);
  };

  if (offer && belongsToUser(offer)) {
    return (
      <Root
        loading={processing}
        stroke={stroke}
        color={color}
        medium={medium}
        small={small}
        onClick={() => {
          handleClick();
        }}
      >
        <FormattedMessage
          id="CancelOffer.submit"
          defaultMessage="Cancel listing"
        />
      </Root>
    );
  }

  return null;
};

CancelOffer.fragments = {
  token: gql`
    fragment CancelOffer_token on Token {
      assetId
      slug
      myMintedSingleSaleOffer {
        id
        blockchainId
        ...useTokenOfferBelongsToUser_offer
      }
    }
    ${useTokenOfferBelongsToUser.fragments.offer}
  `,
};

export default CancelOffer;
