import { gql } from '@apollo/client';

import { Link } from '@sorare/core/src/routing/Link';

import UninteractiveStarterBundlePreview from '@sorare/football/src/components/starterBundle/UninteractiveStarterBundlePreview';

import { StarterBundlePreview_card } from './__generated__/index.graphql';

type Props = {
  to: string;
  cards: StarterBundlePreview_card[];
};

export const StarterBundlePreview = ({ to, cards }: Props) => {
  return (
    <Link to={to}>
      <UninteractiveStarterBundlePreview cards={cards} />
    </Link>
  );
};

StarterBundlePreview.fragments = {
  card: gql`
    fragment StarterBundlePreview_card on Card {
      assetId
      slug
      ...UninteractiveStarterBundlePreview_card
    }
    ${UninteractiveStarterBundlePreview.fragments.card}
  `,
};
export default StarterBundlePreview;
