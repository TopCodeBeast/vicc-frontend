import { gql } from '@apollo/client';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LinearProgress from '@material-ui/core/LinearProgress';
import {
  differenceInMinutes,
  differenceInSeconds,
  isFuture,
  isPast,
  parseISO,
} from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled, { css } from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import LoadingButton from '@sorare/core/src/atoms/buttons/LoadingButton';
import { Popup } from '@sorare/core/src/atoms/layout/Popup';
import { Caption } from '@sorare/core/src/atoms/typography';
import AmountWithConversion from '@sorare/core/src/components/buyActions/AmountWithConversion';
import { useSnackNotificationContext } from '@sorare/core/src/contexts/snackNotification';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { OverrideClasses } from '@sorare/core/src/style/utils';

import TokenNameCancelSalePopin from 'components/token/TokenNameCancelSalePopin';
import useCancelOffer from 'hooks/offers/useCancelOffer';

import {
  CancelSalePopinQuery,
  CancelSalePopinQueryVariables,
} from './__generated__/index.graphql';

export interface Props {
  assetId: string;
  onClose?: () => void;
}

const RemainingMinutesCounter = ({
  remainingMinutes,
}: {
  remainingMinutes: number;
}) => {
  if (remainingMinutes <= 0) {
    return (
      <Caption>
        <FormattedMessage
          id="CancelSalePopin.title.confirmed"
          defaultMessage="Listing confirmed."
        />
      </Caption>
    );
  }
  return (
    <Caption>
      <FormattedMessage
        id="CancelSalePopin.title"
        defaultMessage="Listing confirmed. It will be visible on the Market in {addedMinutes, plural, one {# minute} other {# minutes}}"
        values={{
          addedMinutes: remainingMinutes,
        }}
      />
    </Caption>
  );
};

const tokenFragment = gql`
  fragment CancelSalePopin_token on Token {
    assetId
    slug
    myMintedSingleSaleOffer {
      id
      priceWei
      createdAt
      startDate
      blockchainId
    }
    liveSingleSaleOffer {
      id
    }
    ...TokenNameCancelSalePopin_token
  }
  ${TokenNameCancelSalePopin.fragments.token}
`;

const CANCEL_SALE_POPIN_QUERY = gql`
  query CancelSalePopinQuery($assetId: String!) {
    tokens {
      nft(assetId: $assetId) {
        assetId
        slug
        ...CancelSalePopin_token
      }
    }
  }
  ${tokenFragment}
`;

const Popin = styled.div`
  padding: var(--unit);
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  color: var(--c-neutral-1000);
  .dark-theme & {
    background-color: var(--c-neutral-200);
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
`;

const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  text-align: right;
`;
const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 7px;
  right: 10px;
  color: var(--c-neutral-600);
  height: 20px;
  min-width: 0;
  width: var(--double-and-a-half-unit);
  padding: 0;
`;

const [Progress, classes] = OverrideClasses(LinearProgress, null, {
  colorPrimary: css`
    background-color: rgba(var(--c-rgb-yellow-600), 0.25);
  `,
  barColorPrimary: styled.span`
    background-color: var(--c-yellow-600);
  `,
});
const Close = styled(CloseButton)`
  position: absolute;
  top: 7px;
  right: 10px;
  color: var(--c-neutral-600);
  height: 20px;
  min-width: unset;
  width: 20px;
  padding: 0;
`;

const addedMinutesBeforeSaleStartDate = 2;

export const CancelSalePopin = ({ assetId, onClose }: Props) => {
  const { showNotification } = useSnackNotificationContext();
  const cancelOffer = useCancelOffer();
  const [remainingMinutes, setRemainingMinutes] = useState(
    addedMinutesBeforeSaleStartDate
  );
  const [progress, setProgress] = useState(0);

  const [processing, setProcessing] = useState(false);
  const [closed, setClosed] = useState(false);

  const handleClose = useCallback(() => {
    setClosed(true);
    if (onClose) onClose();
  }, [onClose]);

  const { data } = useQuery<
    CancelSalePopinQuery,
    CancelSalePopinQueryVariables
  >(CANCEL_SALE_POPIN_QUERY, {
    variables: {
      assetId,
    },
    fetchPolicy: 'cache-first',
  });

  const token = data?.tokens?.nft;

  const myMintedSingleSaleOffer = token?.myMintedSingleSaleOffer;
  const liveSingleSaleOffer = token?.liveSingleSaleOffer;

  useEffect(() => {
    if (myMintedSingleSaleOffer && !liveSingleSaleOffer) {
      const { startDate, createdAt } = myMintedSingleSaleOffer;
      const parsedStartDate = parseISO(startDate);
      setRemainingMinutes(differenceInMinutes(parsedStartDate, new Date()));

      const createdDate = parseISO(createdAt);

      if (isFuture(parsedStartDate)) {
        const differenceInSecondsBetweenInitialAndEndDate = differenceInSeconds(
          parsedStartDate,
          createdDate
        );
        const timer = setInterval(() => {
          const now = new Date();
          setRemainingMinutes(differenceInMinutes(parsedStartDate, now) + 1);
          setProgress(() => {
            const differenceInSecondsBetweenInitialDateAndNow =
              differenceInSeconds(now, createdDate);

            const progression =
              (differenceInSecondsBetweenInitialDateAndNow /
                differenceInSecondsBetweenInitialAndEndDate) *
              100.0;

            return Math.min(progression, 100);
          });
        }, 1000);

        return () => {
          clearInterval(timer);
        };
      }
    }
    return () => {};
  }, [myMintedSingleSaleOffer, liveSingleSaleOffer]);

  if (!myMintedSingleSaleOffer || closed || liveSingleSaleOffer) {
    return null;
  }
  const { priceWei, startDate, blockchainId } = myMintedSingleSaleOffer;

  if (isPast(parseISO(startDate))) {
    return null;
  }

  const handleClick = async () => {
    setProcessing(true);
    const error = await cancelOffer(blockchainId!);
    if (!error) showNotification('cancelOffer');

    handleClose();
    setProcessing(false);
  };

  return (
    <Popup>
      <Progress
        classes={classes}
        variant="determinate"
        value={progress}
        color="primary"
      />
      <Popin>
        <Close color="white" onClick={handleClose}>
          <FontAwesomeIcon icon={faTimes} />
        </Close>
        <RemainingMinutesCounter remainingMinutes={remainingMinutes} />
        <Content>
          <LeftContent>
            <TokenNameCancelSalePopin token={token} />
          </LeftContent>
          <RightContent>
            <AmountWithConversion
              context="CancelSalePopin"
              amount={priceWei}
              unit="wei"
              column
            />
          </RightContent>
        </Content>
        <div>
          <LoadingButton
            compact
            stroke
            color="red"
            loading={processing}
            onClick={() => {
              handleClick();
            }}
          >
            <FormattedMessage
              id="CancelSalePopin.cancel"
              defaultMessage="Cancel listing"
            />
          </LoadingButton>
        </div>
      </Popin>
    </Popup>
  );
};

CancelSalePopin.fragments = {
  token: tokenFragment,
};

export default CancelSalePopin;
