import { gql } from '@apollo/client';
import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { Container } from '@sorare/core/src/atoms/container';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Text16, Title2 } from '@sorare/core/src/atoms/typography';
import {
  FOOTBALL_DRAFT,
  FOOTBALL_HOME,
} from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { useGeneratePathWithSearch } from '@sorare/core/src/hooks/useGeneratePathWithSearch';
import { usePreloads } from '@sorare/core/src/hooks/usePreloads';
import useSafePreviousNavigate from '@sorare/core/src/hooks/useSafePreviousNavigate';
import { glossary } from '@sorare/core/src/lib/glossary';
import { theme } from '@sorare/core/src/style/theme';

import { LeaguePicker } from '@football/components/draft/LeaguePicker';
import { LeagueTile } from '@football/components/draft/LeagueTile';
import { OnboardingVideoBanner } from '@football/components/draft/OnboardingVideoBanner';
import { useActiveOnboarding } from '@football/hooks/onboarding/useActiveOnboarding';
import { useFootballEvents } from '@football/lib/events';
import useStartOnboarding from '@football/pages/PickLeague/useStartOnboarding';

import { GetOnboardingDraftCampaignsQuery } from './__generated__/index.graphql';

const Root = styled.div`
  min-height: var(--100vh);
  background-color: var(--c-neutral-100);
  color: var(--c-neutral-1000);
`;

const contentWidthStyle = css`
  width: 100%;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
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
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding: calc(6 * var(--unit)) 0;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--unit);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
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
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    max-width: 400px;
  }
`;

const GET_ONBOARDING_DRAFT_CAMPAIGNS_QUERY = gql`
  query GetOnboardingDraftCampaignsQuery {
    football {
      so5 {
        onboardingCompetitions {
          slug
          commonDraftCampaign {
            slug
            upcomingSo5Leaderboard {
              slug
            }
            ...LeagueTile_commonDraftCampaign
          }
          ...LeaguePicker_onboardingCompetition
        }
      }
    }
  }
  ${LeaguePicker.fragments.onboardingCompetition}
  ${LeagueTile.fragments.commonDraftCampaign}
`;

type Props = {
  preloads: (() => Promise<any>)[];
  allowClosing?: boolean;
};

export const PickLeague = ({ preloads, allowClosing }: Props) => {
  const { data, loading } = useQuery<GetOnboardingDraftCampaignsQuery>(
    GET_ONBOARDING_DRAFT_CAMPAIGNS_QUERY
  );
  const [searchParams] = useSearchParams();
  const track = useFootballEvents();
  const { currentUser } = useCurrentUserContext();
  const isOnboarding = useActiveOnboarding();
  const preloader = usePreloads(preloads);
  const startOnboarding = useStartOnboarding();
  const onGoBack = useSafePreviousNavigate(FOOTBALL_HOME);
  const generatePathWithSearch = useGeneratePathWithSearch();

  const { formatMessage } = useIntl();
  const {
    flags: { showVideoBannerOnOnboarding = 'out' },
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

  const { onboardingCompetitions } = data?.football.so5 || {};

  if (!onboardingCompetitions || loading) {
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
    !!matchingDraftCampaign?.upcomingSo5Leaderboard?.slug;

  return (
    <Root>
      {showVideoBannerOnOnboarding === 'treatment' && isOnboarding && (
        <OnboardingVideoBanner />
      )}
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
                  slug: matchingDraftCampaign.upcomingSo5Leaderboard?.slug,
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
