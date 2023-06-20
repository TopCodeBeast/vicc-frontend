import { gql } from '@apollo/client';
import { forwardRef, useMemo } from 'react';

import { Collection, Sport } from '@sorare/core/src/__generated__/globalTypes';
import { ValidWidths } from '@sorare/core/src/atoms/ui/ResponsiveImg';

import FlexToken, {
  FlexTokenDraggableProps,
} from '@sorare/marketplace/src/components/token/FlexToken';

import { FlexCard_card } from './__generated__/index.graphql';

export type FlexCardDraggableProps = FlexTokenDraggableProps;
export interface FlexCardProps {
  card: FlexCard_card;
  withLink?: boolean;
  draggableProps?: FlexCardDraggableProps;
  width?: ValidWidths;
}

export const FlexCard = forwardRef<HTMLDivElement, FlexCardProps>(
  (props, ref) => {
    const { card, ...rest } = props;
    const flexToken = useMemo(
      () => ({
        ...card,
        assetId: card.assetId!,
        collection: Collection.FOOTBALL,
        sport: Sport.FOOTBALL,
      }),
      [card]
    );
    return <FlexToken ref={ref} token={flexToken} {...rest} />;
  }
);
FlexCard.displayName = 'FlexCard';

FlexCard.fragments = {
  card: gql`
    fragment FlexCard_card on Card {
      slug
      assetId
      pictureUrl: pictureUrl(derivative: "tinified")
    }
  `,
};

export default FlexCard;
