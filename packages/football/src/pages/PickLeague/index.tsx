import { TypedDocumentNode, gql } from '@apollo/client';
import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, useIntl } from 'react-intl';
import { Navigate, useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { Container } from '@sorare/core/src/atoms/container';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Text16, Title2 } from '@sorare/core/src/atoms/typography';
import {
  FOOTBALL_DRAFT,
  FOOTBALL_HOME,
  LANDING,
} from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { useGeneratePathWithSearch } from '@sorare/core/src/hooks/useGeneratePathWithSearch';
import { usePreloads } from '@sorare/core/src/hooks/usePreloads';
import useSafePreviousNavigate from '@sorare/core/src/hooks/useSafePreviousNavigate';
import { glossary } from '@sorare/core/src/lib/glossary';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import { LeaguePicker } from '@football/components/draft/LeaguePicker';
import { LeagueTile } from '@football/components/draft/LeagueTile';
import { useActiveOnboarding } from '@football/hooks/onboarding/useActiveOnboarding';
import { useFootballEvents } from '@football/lib/events';
import useStartOnboarding from '@football/pages/PickLeague/useStartOnboarding';

import {
  GetOnboardingDraftCampaignsQuery,
  GetOnboardingDraftCampaignsQueryVariables,
} from './__generated__/index.graphql';
import { useSkipOnboarding } from './useSkipOnboarding';

const Root = styled.div`
  min-height: var(--100vh);
  background-color: var(--c-neutral-100);
  color: var(--c-neutral-1000);
`;

const contentWidthStyle = css`
  width: 100%;
  @media ${tabletAndAbove} {
    width: 80%;
    max-width: 800px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: var(--quadruple-unit);
  gap: var(--quadruple-unit);
  padding: var(--double-unit) 0;
  @media ${tabletAndAbove} {
    padding: calc(6 * var(--unit)) 0;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--unit);
  @media ${tabletAndAbove} {
    display: grid;
    grid-template-columns: var(--quadruple-unit) 1fr var(--quadruple-unit);
    align-items: center;
  }
  ${contentWidthStyle}
`;
const BackButtonWrapper = styled.div`
  grid-column: 1;
`;
const TitleWrapper = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-column: 2;
  text-align: center;
`;

const SubtitleWrapper = styled.div`
  align-self: center;
`;

const LeaguePickerWrapper = styled.div`
  ${contentWidthStyle}
`;

const LeagueTileWrapper = styled.div`
  ${contentWidthStyle}
  @media ${tabletAndAbove} {
    max-width: 400px;
  }
`;

const GET_ONBOARDING_DRAFT_CAMPAIGNS_QUERY = gql`
  query GetOnboardingDraftCampaignsQuery {
    #football {
      vicc5 {
        onboardingCompetitions {
          slug
          commonDraftCampaign {
            slug
            upcomingVicc5Leaderboard {
              slug
            }
            ...LeagueTile_commonDraftCampaign
          }
          ...LeaguePicker_onboardingCompetition
        }
      }
    #}
  }
  ${LeaguePicker.fragments.onboardingCompetition}
  ${LeagueTile.fragments.commonDraftCampaign}
` as TypedDocumentNode<
  GetOnboardingDraftCampaignsQuery,
  GetOnboardingDraftCampaignsQueryVariables
>;

type Props = {
  preloads: (() => Promise<any>)[];
  allowClosing?: boolean;
};

export const PickLeague = ({ preloads, allowClosing }: Props) => {
  const { data, loading } = useQuery(GET_ONBOARDING_DRAFT_CAMPAIGNS_QUERY);
  const [searchParams] = useSearchParams();
  const track = useFootballEvents();
  const { currentUser } = useCurrentUserContext();
  const isOnboarding = useActiveOnboarding();
  const preloader = usePreloads(preloads);
  const startOnboarding = useStartOnboarding();
  const skipOnboarding = useSkipOnboarding();
  const onGoBack = useSafePreviousNavigate(FOOTBALL_HOME);
  const generatePathWithSearch = useGeneratePathWithSearch();
  const { formatMessage } = useIntl();
  const {
    flags: { useDisableFootballOnboarding = false },
  } = useFeatureFlags();

  const trackLeagueSelection = (
    campaignSlug: string,
    automaticPick: boolean
  ) => {
    track('Pick League', {
      campaignSlug,
      automaticPick,
      isLogged: !!currentUser,
      isOnboarding,
    });
    if (isOnboarding && !!currentUser) {
      startOnboarding();
    }
  };

  const { onboardingCompetitions } = data?.vicc5 || {};

  const shouldSkipOnboarding =
    useDisableFootballOnboarding ||
    (!loading && !onboardingCompetitions?.length);

  if (shouldSkipOnboarding) {
    if (currentUser) {
      skipOnboarding();
    } else {
      return <Navigate to={LANDING} replace />;
    }
  }

  if (!onboardingCompetitions || loading || shouldSkipOnboarding) {
    return (
      <Container>
        <LoadingIndicator fullHeight />
      </Container>
    );
  }

  preloader();

  const leagueFromQueryString = searchParams.get('league');

  const matchingDraftCampaign = onboardingCompetitions.find(
    ({ commonDraftCampaign }) =>
      commonDraftCampaign?.slug === leagueFromQueryString
  )?.commonDraftCampaign;

  const hasMatchingDraftCampaignFromQuery =
    !!matchingDraftCampaign?.upcomingVicc5Leaderboard?.slug;

  return (
    <Root>
      <Container>
        <ContentWrapper>
          <HeaderWrapper>
            {allowClosing && (
              <BackButtonWrapper>
                <IconButton small color="white" onClick={onGoBack}>
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    title={formatMessage(glossary.cancel)}
                  />
                </IconButton>
              </BackButtonWrapper>
            )}
            <TitleWrapper>
              <Title2 as="h1">
                {hasMatchingDraftCampaignFromQuery ? (
                  <FormattedMessage
                    id="OnboardingPickLeague.leagueSelectedTitle"
                    defaultMessage="Ready to play?"
                  />
                ) : (
                  <FormattedMessage
                    id="OnboardingPickLeague.title"
                    defaultMessage="Select the league to play in"
                  />
                )}
              </Title2>
            </TitleWrapper>
          </HeaderWrapper>
          {hasMatchingDraftCampaignFromQuery ? (
            <LeagueTileWrapper>
              <LeagueTile
                commonDraftCampaign={matchingDraftCampaign}
                onClick={() => {
                  trackLeagueSelection(matchingDraftCampaign.slug, true);
                }}
                to={generatePathWithSearch(FOOTBALL_DRAFT, {
                  slug: matchingDraftCampaign.upcomingVicc5Leaderboard?.slug,
                })}
              />
            </LeagueTileWrapper>
          ) : (
            <LeaguePickerWrapper>
              <LeaguePicker
                onboardingCompetitions={onboardingCompetitions}
                onLeagueSelection={(campaignSlug: string) => {
                  trackLeagueSelection(campaignSlug, false);
                }}
              />
            </LeaguePickerWrapper>
          )}
          {!hasMatchingDraftCampaignFromQuery && (
            <SubtitleWrapper>
              <Text16 color="rgba(var(--c-rgb-neutral-1000), 0.5)">
                <FormattedMessage
                  id="OnboardingPickLeague.subtitle"
                  defaultMessage="You can always join other leagues later"
                />
              </Text16>
            </SubtitleWrapper>
          )}
        </ContentWrapper>
      </Container>
    </Root>
  );
};

export default PickLeague;
