import { TypedDocumentNode, gql } from '@apollo/client';

import { Position } from '@sorare/core/src/__generated__/globalTypes';
import UninteractiveToken from '@sorare/core/src/components/token/UninteractiveToken';

import UninteractiveStarterBundlePreviewSkeleton from '@football/components/starterBundle/UninteractiveStarterBundlePreviewSkeleton';

import { UninteractiveStarterBundlePreview_card } from './__generated__/index.graphql';

type Props = {
  cards: UninteractiveStarterBundlePreview_card[];
  bigger?: boolean;
};

export const UninteractiveStarterBundlePreview = ({
  cards,
  bigger = false,
}: Props) => {
  if (cards.length < 5) return null;
  const forward = cards.find(c => c.position === Position.Bowler);
  const goalkeeper = cards.find(c => c.position === Position.Wicketkeeper);
  const defender = cards.find(c => c.position === Position.Batsman);
  const midfielder = cards.find(c => c.position === Position.Fielder);
  const extra = cards.find(
    c =>
      ![
        forward?.assetId,
        goalkeeper?.assetId,
        midfielder?.assetId,
        defender?.assetId,
      ].includes(c.assetId)
  );
  if (!forward || !goalkeeper || !defender || !midfielder || !extra)
    return null;

  const tokenWidth = bigger ? 160 : 80;

  return (
    <UninteractiveStarterBundlePreviewSkeleton
      bigger={bigger}
      goalkeeperCard={
        <UninteractiveToken width={tokenWidth} token={goalkeeper.token!} />
      }
      defenderCard={
        <UninteractiveToken width={tokenWidth} token={defender.token!} />
      }
      midfielderCard={
        <UninteractiveToken width={tokenWidth} token={midfielder.token!} />
      }
      forwardCard={
        <UninteractiveToken width={tokenWidth} token={forward.token!} />
      }
      extraCard={<UninteractiveToken width={tokenWidth} token={extra.token!} />}
    />
  );
};

UninteractiveStarterBundlePreview.fragments = {
  card: gql`
    fragment UninteractiveStarterBundlePreview_card on Card {
      assetId
      slug
      position
      token {
        slug
        assetId
        ...UninteractiveToken_token
      }
    }
    ${UninteractiveToken.fragments.token}
  ` as TypedDocumentNode<UninteractiveStarterBundlePreview_card>,
};
export default UninteractiveStarterBundlePreview;
