import { TypedDocumentNode, gql } from '@apollo/client';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { OwnerTransfer } from '@sorare/core/src/__generated__/globalTypes';
import Since from '@sorare/core/src/contexts/intl/Since';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';

import ItemUser from '@sorare/marketplace/src/components/ItemPreview/ItemUser';
import TokenTransferTypeIcon from '@sorare/marketplace/src/components/token/TokenTransferTypeIcon';

import CardDescription from '@football/components/card/CardDescription';
import FlexCard from '@football/components/card/FlexCard';
import CardProperties from '@football/components/so5/CardProperties';

import { CommonCardPreview_card } from './__generated__/index.graphql';

const MobileCommonCardContainer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: min-content 1fr;
  width: 100%;
  align-items: center;
  gap: var(--unit);
`;

const MobileCommonCardImgContainer = styled.div`
  width: var(--card-mobile-width);
`;
const MobileCardData = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: var(--half-unit);
  overflow: hidden;
`;

const CardFrame = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: var(--unit);
  gap: var(--intermediate-unit);
`;
const CardDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const Line = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const ActionWrapper = styled.div`
  position: absolute;
  right: var(--unit);
  top: var(--unit);
  display: none;
  ${CardFrame}:hover & {
    display: block;
  }
`;

const getTokenTransferTypeFromCard = (transferType: string) => {
  switch (transferType) {
    case 'reward':
      return OwnerTransfer.REWARD;
    case 'transfer':
      return OwnerTransfer.TRANSFER;
    default:
      return OwnerTransfer.TRANSFER;
  }
};

type Props = {
  card: CommonCardPreview_card;
  hideDetails?: boolean;
  action?: ReactNode;
};
const CommonCardPreview = ({ card, hideDetails, action }: Props) => {
  const { up: isTablet } = useScreenSize('tablet');

  if (!isTablet && !hideDetails) {
    return (
      <MobileCommonCardContainer>
        <MobileCommonCardImgContainer>
          <FlexCard withLink card={card} />
        </MobileCommonCardImgContainer>
        <MobileCardData>
          <Line>
            <CardProperties card={card} />
            {card.ownerSince && <Since date={card.ownerSince} />}
          </Line>
          <CardDescription card={card} />
          {card?.owner && (
            <TokenTransferTypeIcon
              transferType={getTokenTransferTypeFromCard(
                card.owner.transferType
              )}
            />
          )}
          {card.user && <ItemUser item={card.user} />}
        </MobileCardData>
      </MobileCommonCardContainer>
    );
  }
  return (
    <CardFrame>
      <FlexCard withLink card={card} />
      {action && <ActionWrapper>{action}</ActionWrapper>}
      {!hideDetails && (
        <CardDetails>
          <CardProperties card={card} />
          {card?.owner && (
            <TokenTransferTypeIcon
              transferType={getTokenTransferTypeFromCard(
                card.owner.transferType
              )}
            />
          )}
          {card.ownerSince && <Since date={card.ownerSince} />}
        </CardDetails>
      )}
    </CardFrame>
  );
};

CommonCardPreview.fragments = {
  card: gql`
    fragment CommonCardPreview_card on Card {
      assetId
      slug
      ownerSince
      owner {
        transferType
      }
      user {
        slug
        ...ItemUser_user
      }
      ...CardDescription_card
      ...CardProperties_card
      ...FlexCard_card
    }
    ${ItemUser.fragments.user}
    ${FlexCard.fragments.card}
    ${CardProperties.fragments.card}
    ${CardDescription.fragments.card}
  ` as TypedDocumentNode<CommonCardPreview_card>,
};
export default CommonCardPreview;
