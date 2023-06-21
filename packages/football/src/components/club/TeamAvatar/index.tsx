import { gql } from '@apollo/client';
import { Maybe } from 'graphql/jsutils/Maybe';
import { useIntl } from 'react-intl';

import FlagAvatar from '@sorare/core/src/components/country/FlagAvatar';
import { isA } from '@sorare/core/src/lib/gql';

import ClubAvatar from '@football/components/club/ClubAvatar';

import {
  TeamAvatar_team,
  TeamAvatar_team_Club_ as TeamAvatar_team_Club,
  TeamAvatar_team_NationalTeam_ as TeamAvatar_team_NationalTeam,
} from './__generated__/index.graphql';
import messages from './i18n';

type Props = {
  withTooltip?: boolean;
  className?: string;
  team: Maybe<TeamAvatar_team>;
  size?: number;
};

export const TeamAvatar = ({ team, withTooltip, className, size }: Props) => {
  const { formatMessage } = useIntl();

  if (!team || isA('Club', team)) {
    return (
      <ClubAvatar
        className={className}
        club={
          team
            ? (team as TeamAvatar_team_Club)
            : {
                __typename: 'Club',
                slug: '',
                name: formatMessage(messages.noneName),
                avatarUrl: null,
              }
        }
        withTooltip={withTooltip}
        size={size}
      />
    );
  }
  return (
    <FlagAvatar
      className={className}
      country={(team as TeamAvatar_team_NationalTeam).country}
      imageRes={64}
      withTooltip={withTooltip}
      size={size}
    />
  );
};

TeamAvatar.fragments = {
  team: gql`
    fragment TeamAvatar_team on Team {
      ... on TeamInterface {
        slug
      }
      ... on Club {
        slug
        ...ClubAvatar_club
      }
      ... on NationalTeam {
        slug
        country {
          slug
        }
      }
    }
    ${ClubAvatar.fragments.club}
  `,
};

export default TeamAvatar;
