import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Dialog from '@sorare/core/src/atoms/layout/Dialog';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import { Chip } from '@sorare/core/src/atoms/ui/Chip';
import { Rank } from '@sorare/core/src/components/lobby/Rank';
import { GalleryLink } from '@sorare/core/src/components/user/GalleryLink';
import { Nickname } from '@sorare/core/src/components/user/Nickname';
import SocialShare from '@sorare/core/src/components/user/SocialShare';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import idFromObject from '@sorare/core/src/gql/idFromObject';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import {
  socialShareEventContext,
  socialShareEventName,
} from '@sorare/core/src/lib/events';
import { glossary } from '@sorare/core/src/lib/glossary';

import DivisionLogo from '@football/components/so5/DivisionLogo';
import Points from '@football/components/so5/Points';
import So5LineupAppearance from '@football/components/so5/So5LineupAppearance';
import { socialSharingMessages } from '@football/lib/so5';

import {
  So5RankingDetailsQuery,
  So5RankingDetailsQueryVariables,
} from './__generated__/index.graphql';

export const SO5_RANKING_DETAILS_QUERY = gql`
  query So5RankingDetailsQuery($id: ID!) {
    football {
      so5 {
        so5Ranking(id: $id) {
          id
          ranking
          score
          tiebreakerScore
          so5Leaderboard {
            slug
            displayName
            ...DivisionLogo_so5Leaderboard
          }
          so5Lineup {
            id
            cancelledAt
            user {
              slug
              ...Nickname_publicUserInfoInterface
            }
            so5Appearances {
              ...So5LineupAppearance_so5Appearance
            }
            ...SocialShare_SocialPictures
          }
        }
      }
    }
  }
  ${DivisionLogo.fragments.so5Leaderboard}
  ${So5LineupAppearance.fragments.so5Appearance}
  ${SocialShare.fragments.socialPictures}
  ${Nickname.fragments.user}
`;
type Props = {
  so5RankingId: string | null;
  onClose: () => void;
};

const User = styled.div`
  flex: 1;
`;
const StyledLoadingIndicator = styled.div`
  padding: 20px;
`;
const Content = styled.div`
  overflow: auto;
`;
const Leaderboard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 20px;
  border-bottom: 1px solid var(--c-neutral-300);
`;
const Division = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;
const RankAndScore = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
`;
const TiebreakerScore = styled.div`
  text-align: right;
  padding: 10px;
`;

export const So5LineupDetails = (props: Props) => {
  const { formatMessage } = useIntlContext();
  const { so5RankingId, onClose } = props;
  const { loading, data } = useQuery<
    So5RankingDetailsQuery,
    So5RankingDetailsQueryVariables
  >(SO5_RANKING_DETAILS_QUERY, {
    variables: { id: idFromObject(so5RankingId)! },
    skip: !so5RankingId,
    nextFetchPolicy: 'cache-first',
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000,
  });

  if (!data) {
    if (loading) {
      return (
        <StyledLoadingIndicator>
          <LoadingIndicator />
        </StyledLoadingIndicator>
      );
    }
    return null;
  }

  const { so5Ranking } = data.football.so5;
  const { ranking, score, so5Leaderboard, so5Lineup } = so5Ranking;
  const { cancelledAt, so5Appearances, user } = so5Lineup;

  return (
    <Dialog
      open
      title={
        <>
          <User>
            <GalleryLink user={user}>
              <Nickname user={user} />
            </GalleryLink>
          </User>
          <SocialShare
            image={so5Lineup.socialPictureUrls}
            title={formatMessage(socialSharingMessages.lineup)}
            trackingEventName={socialShareEventName.SHARE_LINEUP}
            trackingEventContext={socialShareEventContext.LEADERBOARD}
            renderButton={({ ShareButton, label, Icon }) => (
              <ShareButton medium startIcon={Icon}>
                {label}
              </ShareButton>
            )}
          />
        </>
      }
      onClose={onClose}
      noMargin
    >
      <Content>
        <Leaderboard>
          <Division>
            <DivisionLogo so5Leaderboard={so5Leaderboard} />
            <Text16 bold>{so5Leaderboard.displayName}</Text16>
          </Division>
          <RankAndScore>
            {cancelledAt ? (
              <Chip
                label={<FormattedMessage {...glossary.canceled} />}
                custom={{
                  color: 'white',
                  background: 'var(--c-red-600)',
                }}
                size="smaller"
              />
            ) : (
              <>
                <Text16 bold as="div">
                  <Rank rank={ranking} />
                </Text16>
                <Text16 bold color="var(--c-neutral-600)">
                  <Points score={score} />
                </Text16>
              </>
            )}
          </RankAndScore>
        </Leaderboard>
        <div>
          {so5Appearances.map(so5Appearance => (
            <So5LineupAppearance
              key={so5Appearance.id}
              so5Appearance={so5Appearance}
            />
          ))}
        </div>
        {so5Ranking.tiebreakerScore > 0 && (
          <TiebreakerScore>
            <Text14>
              <FormattedMessage
                id="So5LienupDetails.tiebreakerScore"
                defaultMessage="Tiebreaker score: <strong>{score, number, ::.00} pts</strong>"
                values={{ strong: Bold, score: so5Ranking.tiebreakerScore }}
              />
            </Text14>
          </TiebreakerScore>
        )}
      </Content>
    </Dialog>
  );
};

export default So5LineupDetails;
