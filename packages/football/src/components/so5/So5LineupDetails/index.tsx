import { TypedDocumentNode, gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import { Chip } from '@sorare/core/src/atoms/ui/Chip';
import Dialog from '@sorare/core/src/components/dialog';
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
import Vicc5LineupAppearance from '@football/components/so5/So5LineupAppearance';
import { socialSharingMessages } from '@football/lib/so5';

import {
  Vicc5RankingDetailsQuery,
  Vicc5RankingDetailsQueryVariables,
} from './__generated__/index.graphql';

const Header = styled.div`
  width: 100%;
  padding: 0 var(--unit);
  display: grid;
  align-items: center;
  grid-template-columns: 1fr min-content;
`;
const CenteredText16 = styled(Text16)`
  text-align: center;
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

export const SO5_RANKING_DETAILS_QUERY = gql`
  query Vicc5RankingDetailsQuery($id: ID!) {
    #football {
      vicc5Root {
        vicc5Ranking(id: $id) {
          id
          ranking
          score
          tiebreakerScore
          vicc5Leaderboard {
            slug
            displayName
            ...DivisionLogo_vicc5Leaderboard
          }
          vicc5Lineup {
            id
            cancelledAt
            user {
              slug
              ...Nickname_publicUserInfoInterface
            }
            vicc5Appearances {
              ...Vicc5LineupAppearance_vicc5Appearance
            }
            ...SocialShare_SocialPictures
          }
        }
      }
    #}
  }
  ${DivisionLogo.fragments.vicc5Leaderboard}
  ${Vicc5LineupAppearance.fragments.vicc5Appearance}
  ${SocialShare.fragments.socialPictures}
  ${Nickname.fragments.user}
` as TypedDocumentNode<Vicc5RankingDetailsQuery, Vicc5RankingDetailsQueryVariables>;
type Props = {
  vicc5RankingId: string | null;
  onClose: () => void;
};

export const Vicc5LineupDetails = (props: Props) => {
  const { formatMessage } = useIntlContext();
  const { vicc5RankingId, onClose } = props;
  const { loading, data } = useQuery(SO5_RANKING_DETAILS_QUERY, {
    variables: { id: idFromObject(vicc5RankingId)! },
    skip: !vicc5RankingId,
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

  const { vicc5Ranking } = data.vicc5;
  const { ranking, score, vicc5Leaderboard, vicc5Lineup } = vicc5Ranking;
  const { cancelledAt, vicc5Appearances, user } = vicc5Lineup;

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      open
      title={
        <Header>
          <CenteredText16 bold>
            <GalleryLink user={user}>
              <Nickname user={user} />
            </GalleryLink>
          </CenteredText16>
          <SocialShare
            image={vicc5Lineup.socialPictureUrls}
            title={formatMessage(socialSharingMessages.lineup)}
            trackingEventName={socialShareEventName.SHARE_LINEUP}
            trackingEventContext={socialShareEventContext.LEADERBOARD}
            renderButton={({ ShareButton, label, Icon }) => (
              <ShareButton medium startIcon={Icon}>
                {label}
              </ShareButton>
            )}
          />
        </Header>
      }
      onClose={onClose}
      body={
        <Content>
          <Leaderboard>
            <Division>
              <DivisionLogo vicc5Leaderboard={vicc5Leaderboard} />
              <Text16 bold>{vicc5Leaderboard.displayName}</Text16>
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
            {vicc5Appearances.map(vicc5Appearance => (
              <Vicc5LineupAppearance
                key={vicc5Appearance.id}
                vicc5Appearance={vicc5Appearance}
              />
            ))}
          </div>
          {vicc5Ranking.tiebreakerScore > 0 && (
            <TiebreakerScore>
              <Text14>
                <FormattedMessage
                  id="Vicc5LienupDetails.tiebreakerScore"
                  defaultMessage="Tiebreaker score: <strong>{score, number, ::.00} pts</strong>"
                  values={{ strong: Bold, score: vicc5Ranking.tiebreakerScore }}
                />
              </Text14>
            </TiebreakerScore>
          )}
        </Content>
      }
    />
  );
};

export default Vicc5LineupDetails;
