import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';

import { Text14 } from '@sorare/core/src/atoms/typography';

import { CardTeams_card } from './__generated__/index.graphql';

type Props = {
  card: CardTeams_card;
};

const CardTeams = ({ card }: Props) => {
  const { team, player } = card;
  const { slug, name } = team;

  const activeClubSlug = player?.activeClub?.slug;
  const activeClubName = player?.activeClub?.name;

  return (
    <>
      <Text14 color="var(--c-neutral-600)">{name}</Text14>
      {activeClubSlug !== slug && (
        <Text14 color="var(--c-neutral-600)">
          <FormattedMessage
            id="CardTeams.currentClub"
            defaultMessage="Current club: {activeClubName}"
            values={{ activeClubName }}
          />
        </Text14>
      )}
    </>
  );
};

CardTeams.fragments = {
  card: gql`
    fragment CardTeams_card on Card {
      assetId
      slug
      team {
        ... on Club {
          id
          slug
          name
        }
        ... on NationalTeam {
          id
          slug
          name
        }
      }
      player {
        id
        slug
        activeClub {
          id
          slug
          name
        }
      }
    }
  ` as TypedDocumentNode<CardTeams_card>,
};

export default CardTeams;
