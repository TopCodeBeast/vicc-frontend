import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { generatePath } from 'react-router-dom';

import Tooltip from '@core/atoms/tooltip/Tooltip';
import { Text14 } from '@core/atoms/typography';
import { FOOTBALL_LOBBY_UPCOMING_SWAP } from '@core/constants/routes';
import { Link } from '@core/routing/Link';

import { LineupActionCta } from '../LineupActionCta';
import { SwapCta_vicc5Leaderboard } from './__generated__/index.graphql';

type Props = {
  onTrack: () => void;
  vicc5Leaderboard: SwapCta_vicc5Leaderboard;
};
export const SwapCta = ({ onTrack, vicc5Leaderboard }: Props) => {
  return vicc5Leaderboard?.commonDraftCampaign?.availableSwapsCountForUpcoming ? (
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
          leaderboardSlug: vicc5Leaderboard.slug,
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
  vicc5Leaderboard: gql`
    fragment SwapCta_vicc5Leaderboard on Vicc5Leaderboard {
      slug
      commonDraftCampaign {
        slug
        availableSwapsCountForUpcoming
      }
    }
  ` as TypedDocumentNode<SwapCta_vicc5Leaderboard>,
};
