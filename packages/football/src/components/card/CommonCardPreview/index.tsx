import { gql } from '@apollo/client';
import styled from 'styled-components';

import { OwnerTransfer } from '@sorare/core/src/__generated__/globalTypes';
import Since from '@sorare/core/src/contexts/intl/Since';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { theme } from '@sorare/core/src/style/theme';

import ItemUser from '@sorare/marketplace/src/components/ItemPreview/ItemUser';
import TokenTransferTypeIcon from '@sorare/marketplace/src/components/token/TokenTransferTypeIcon';

import CardDescription from '@football/components/card/CardDescription';
import FlexCard from '@football/components/card/FlexCard';
import CardProperties from '@football/components/so5/CardProperties';

import { CommonCardPreview_card } from './__generated__/index.graphql';

const MobileCommonCardContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: ${theme.spacing()}px;
`;

const MobileCommonCardImgContainer = styled.div`
  width: ${theme.cardGrid.card.mobileWidth}px;
`;
const MobileCardData = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: var(--half-unit);
`;

const CardFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: ${theme.shape.borderRadius}px;
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

const CommonCardPreview = ({ card }: { card: CommonCardPreview_card }) => {
  const { up: isTablet } = useScreenSize('tablet');

  if (!isTablet) {
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
      <CardDetails>
        <CardProperties card={card} />
        {card?.owner && (
          <TokenTransferTypeIcon
            transferType={getTokenTransferTypeFromCard(card.owner.transferType)}
          />
        )}
        {card.ownerSince && <Since date={card.ownerSince} />}
      </CardDetails>
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
  `,
};
export default CommonCardPreview;
