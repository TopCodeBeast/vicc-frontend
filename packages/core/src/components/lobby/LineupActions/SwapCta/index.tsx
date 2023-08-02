import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';

import Tooltip from '@core/atoms/tooltip/Tooltip';
import { Text14 } from '@core/atoms/typography';
import { FOOTBALL_LOBBY_UPCOMING_SWAP } from '@core/constants/routes';
import { Link } from '@core/routing/Link';

import { LineupActionCta } from '../LineupActionCta';
import { SwapCta_so5Leaderboard } from './__generated__/index.graphql';

type Props = {
  onTrack: () => void;
  so5Leaderboard: SwapCta_so5Leaderboard;
};
export const SwapCta = ({ onTrack, so5Leaderboard }: Props) => {
  return so5Leaderboard?.commonDraftCampaign?.availableSwapsCountForUpcoming ? (
    <Tooltip
      title={
        <Text14>
          <FormattedMessage
            id="Lobby.LineupActions.Tooltip.Swap"
            defaultMessage="Swap up to 2 Cards"
          />
        </Text14>
      }
      placement="top-end"
    >
      <LineupActionCta
        color="white"
        component={Link}
        to={generatePath(FOOTBALL_LOBBY_UPCOMING_SWAP, {
          leaderboardSlug: so5Leaderboard.slug,
        })}
        onClick={() => onTrack()}
      >
        <FormattedMessage
          id="Lobby.LineupActions.Swap.Cta"
          defaultMessage="Swap"
        />
      </LineupActionCta>
    </Tooltip>
  ) : null;
};

export default SwapCta;

SwapCta.fragments = {
  so5Leaderboard: gql`
    fragment SwapCta_so5Leaderboard on So5Leaderboard {
      slug
      commonDraftCampaign {
        slug
        availableSwapsCountForUpcoming
      }
    }
  ` as TypedDocumentNode<SwapCta_so5Leaderboard>,
};
