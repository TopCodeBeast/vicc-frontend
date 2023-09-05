import { TypedDocumentNode } from '@apollo/client';
import { gql } from '@apollo/client/core';
import { faUsers } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import privateLeague from '@sorare/core/src/assets/private-league.png';
import experiences from '@sorare/core/src/assets/rewards/experiences.png';
import jerseys from '@sorare/core/src/assets/rewards/jerseys.png';
import tickets from '@sorare/core/src/assets/rewards/tickets.png';
import Button from '@sorare/core/src/atoms/buttons/Button';
import { Caption, Text14 } from '@sorare/core/src/atoms/typography';
import Bold from '@sorare/core/src/atoms/typography/Bold';
import { ConversionCreditCampaignBanner } from '@sorare/core/src/components/conversionCredit/ConversionCreditCampaignBanner';
import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';
import {
  FOOTBALL_DRAFT,
  FOOTBALL_ONBOARDING,
} from '@sorare/core/src/constants/routes';
import { useConnectionContext } from '@sorare/core/src/contexts/connection';
import { useSeoContext } from '@sorare/core/src/contexts/seo';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import useEvents from '@sorare/core/src/lib/events/useEvents';
import { glossary } from '@sorare/core/src/lib/glossary';

import cards from '@football/assets/home/rewards/cards.png';
import coin from '@football/assets/home/rewards/coin.png';
import eth from '@football/assets/home/rewards/eth.png';

import Section from './Section';
import Slider from './Slider';
import {
  HomeDataQuery,
  HomeDataQueryVariables,
} from './__generated__/index.graphql';

import '@sorare/core/src/style/drukFontFaces.css';
import '@sorare/core/src/style/romieFontFaces.css';

const HOME_DATA_QUERY = gql`
  query HomeDataQuery {
    #football {
      vicc5 {
        onboardingCommonDraftCampaigns {
          slug
          displayName
          competitions {
            slug
            name
            released
            logoUrl
          }
          upcomingVicc5Leaderboard {
            slug
            vicc5LineupsCount
          }
        }
      }
    #}
  }
` as TypedDocumentNode<HomeDataQuery, HomeDataQueryVariables>;

const Root = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--quadruple-unit);
  background: var(--c-neutral-100);
  color: var(--c-neutral-1000);
  padding-bottom: var(--quadruple-unit);
`;
const MoreLeagues = styled.footer`
  text-align: center;
`;
const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  margin-bottom: var(--double-unit);
`;
const Article = styled.article`
  display: flex;
  align-items: center;
  gap: var(--intermediate-unit);
  border-radius: var(--double-unit);
  background: var(--c-neutral-200);
  padding: var(--intermediate-unit) var(--double-unit);
  &,
  &:hover {
    color: var(--c-neutral-1000);
  }
  &[href]:hover {
    background: var(--c-neutral-300);
  }
  &.pro {
    background: linear-gradient(
        84.1deg,
        rgba(128, 148, 255, 0.2) 0%,
        rgba(217, 199, 255, 0.2) 28.32%,
        rgba(228, 184, 255, 0.2) 54.55%,
        rgba(45, 66, 178, 0.2) 100%
      ),
      #2b2d33;
  }
  &.exclusive {
    background: linear-gradient(
        113.54deg,
        rgba(77, 65, 217, 0.188) 0%,
        rgba(255, 105, 249, 0.2) 45.69%,
        rgba(85, 48, 107, 0.2) 100%
      ),
      #22242b;
  }
`;
const ArticleCaption = styled(Caption)`
  strong {
    color: var(--c-neutral-100);
  }
`;
const HorizontalList = styled.section`
  overflow: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  display: flex;
  gap: var(--unit);
  padding-bottom: var(--half-unit);
  > * {
    width: 100%;
    min-width: max(180px, calc(100% / 6 - var(--unit) + var(--unit) / 6));
    scroll-snap-align: center;
  }
`;

const messages = defineMessages({
  title1: {
    id: 'Football.Home.Public.title1',
    defaultMessage: 'Build your <strong>Legacy</strong>',
    values: { br: <br />, strong: (...c: string[]) => <strong>{c}</strong> },
  },
  title2: {
    id: 'Football.Home.Public.title2',
    defaultMessage: 'Play with <strong>friends</strong>',
    values: { br: <br />, strong: (...c: string[]) => <strong>{c}</strong> },
  },
  title3: {
    id: 'Football.Home.Public.title3',
    defaultMessage: 'Compete for <strong>epic rewards</strong>',
    values: { br: <br />, strong: (...c: string[]) => <strong>{c}</strong> },
  },
  title4: {
    id: 'Football.Home.Public.title4',
    defaultMessage: 'Scout the next <strong>superstars</strong>',
    values: { br: <br />, strong: (...c: string[]) => <strong>{c}</strong> },
  },
});

const meta = defineMessages({
  title: {
    id: 'Football.Home.Public.meta.title',
    defaultMessage: 'The free-to-play Fantasy Football Game - Vicc: Football',
  },
  description: {
    id: 'Football.Home.Public.meta.description',
    defaultMessage:
      'Collect, play and win officially licensed digital cards featuring the world’s best Football players from the best leagues including the Premier League, LaLiga Santander and much more!',
  },
});

const rewards = [
  {
    label: 'Coins',
    type: 'amateur' as const,
    img: coin,
  },
  {
    label: glossary.cards,
    type: 'pro' as const,
    img: cards,
  },
  {
    label: 'ETH',
    type: 'pro' as const,
    img: eth,
  },
  {
    label: glossary.experiences,
    type: 'pro' as const,
    img: experiences,
  },
  {
    label: glossary.jerseys,
    type: 'exclusive' as const,
    img: jerseys,
  },
  {
    label: glossary.tickets,
    type: 'exclusive' as const,
    img: tickets,
  },
];

const FootballPublicHome = () => {
  const { formatMessage } = useIntl();
  const track = useEvents();
  const { setPageMetadata } = useSeoContext();
  const { signUp } = useConnectionContext();
  const { data } = useQuery(HOME_DATA_QUERY);
  const {
    flags: { useDisableFootballOnboarding = false },
  } = useFeatureFlags();
  const {
    onboardingCommonDraftCampaigns = [1, 2, 3, 4].map(id => ({
      displayName: '',
      competitions: [{ released: true, slug: id, logoUrl: '' }],
      upcomingVicc5Leaderboard: { vicc5LineupsCount: 0, slug: '' },
    })),
  } = data?.vicc5 || {};
  const sizes = Object.entries({
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
    full: undefined,
  });

  useEffect(
    () =>
      setPageMetadata(formatMessage(meta.title), {
        description: formatMessage(meta.description),
      }),
    [setPageMetadata, formatMessage]
  );

  const regularSignup =
    !data?.vicc5.onboardingCommonDraftCampaigns?.length ||
    useDisableFootballOnboarding;

  return (
    <>
      <ConversionCreditCampaignBanner />
      <section>
        <Root className="dark-theme">
          <Slider
            key="slider"
            slides={[
              {
                title: messages.title1,
                sources: sizes.map(([size, value]) => ({
                  srcSet: `${FRONTEND_ASSET_HOST}/home/${size}/top.jpg`,
                  media: value ? `(max-width: ${value}px)` : undefined,
                })),
                src: `${FRONTEND_ASSET_HOST}/home/xl/top.jpg`,
              },
              {
                title: messages.title2,
                sources: sizes.map(([size, value]) => ({
                  srcSet: `${FRONTEND_ASSET_HOST}/home/${size}/top-1.jpg`,
                  media: value ? `(max-width: ${value}px)` : undefined,
                })),
                src: `${FRONTEND_ASSET_HOST}/home/xl/top-1.jpg`,
              },
              {
                title: messages.title3,
                sources: sizes.map(([size, value]) => ({
                  srcSet: `${FRONTEND_ASSET_HOST}/home/${size}/top-2.jpg`,
                  media: value ? `(max-width: ${value}px)` : undefined,
                })),
                src: `${FRONTEND_ASSET_HOST}/home/xl/top-2.jpg`,
              },
              {
                title: messages.title4,
                sources: sizes.map(([size, value]) => ({
                  srcSet: `${FRONTEND_ASSET_HOST}/home/${size}/top-3.jpg`,
                  media: value ? `(max-width: ${value}px)` : undefined,
                })),
                src: `${FRONTEND_ASSET_HOST}/home/xl/top-3.jpg`,
              },
            ]}
          >
            <Button
              component={regularSignup ? undefined : Link}
              to={regularSignup ? undefined : FOOTBALL_ONBOARDING}
              color="black"
              medium
              onClick={() => {
                if (regularSignup) {
                  signUp();
                }
                track('[FOOTBALL_LANDING] Click Start your journey');
              }}
            >
              <FormattedMessage
                id="Football.Home.Public.cta"
                defaultMessage="Start your journey"
              />
            </Button>
          </Slider>

          <Section
            title={
              <FormattedMessage
                id="Football.Home.Public.compete.title"
                defaultMessage="Compete in the best leagues"
              />
            }
            subtitle={
              <FormattedMessage
                id="Football.Home.Public.compete.subtitle"
                defaultMessage="Play one or multiple global leagues and become the best Vicc: Football General Manager"
              />
            }
          >
            {regularSignup ? (
              <div>
                <Button
                  color="blue"
                  medium
                  onClick={() => {
                    signUp();
                    track('[FOOTBALL_LANDING] Click Signup to compete');
                  }}
                >
                  <FormattedMessage
                    id="Football.Home.Public.compete.cta"
                    defaultMessage="Signup to compete"
                  />
                </Button>
              </div>
            ) : (
              <>
                <List>
                  {onboardingCommonDraftCampaigns.map(
                    ({ competitions, displayName, upcomingVicc5Leaderboard }: any) => {
                      const competition = competitions[0];
                      if (!competition) {
                        return null;
                      }
                      return (
                        <Article
                          as={Link}
                          key={competition.slug}
                          to={generatePath(FOOTBALL_DRAFT, {
                            slug: upcomingVicc5Leaderboard?.slug,
                          })}
                        >
                          {competition.logoUrl ? (
                            <img
                              src={competition.logoUrl}
                              alt=""
                              width="32"
                              height="32"
                            />
                          ) : (
                            <svg viewBox="0 0 32 32" width="32">
                              <circle
                                fill="currentColor"
                                r="16"
                                cx="16"
                                cy="16"
                              />
                            </svg>
                          )}
                          <div>
                            <Text14 bold>{displayName}</Text14>
                            <ArticleCaption color="var(--c-neutral-600)">
                              <FormattedMessage
                                id="Football.Home.Public.TotalManagers"
                                defaultMessage={`{
                    nb, plural, =0 {No Managers entered yet}
                    one {<strong>{icon} #</strong> Manager entered}
                    other {<strong>{icon} #</strong> Managers entered}}`}
                                values={{
                                  nb: upcomingVicc5Leaderboard?.vicc5LineupsCount,
                                  icon: <FontAwesomeIcon icon={faUsers} />,
                                  strong: Bold,
                                }}
                              />
                            </ArticleCaption>
                          </div>
                        </Article>
                      );
                    }
                  )}
                </List>
                <MoreLeagues>
                  <Link to={FOOTBALL_ONBOARDING}>
                    <Text14 bold color="var(--c-neutral-1000)">
                      <FormattedMessage
                        id="Football.Home.Public.compete.more"
                        defaultMessage="+{nb} more leagues"
                        values={{
                          nb: 32,
                        }}
                      />
                    </Text14>
                  </Link>
                </MoreLeagues>
              </>
            )}
          </Section>
          <Section
            title={
              <FormattedMessage
                id="Football.Home.Public.rewards.title"
                defaultMessage="Win exclusive digital and physical rewards"
              />
            }
            subtitle={
              <FormattedMessage
                id="Football.Home.Public.rewards.subtitle"
                defaultMessage="Only available to Vicc Managers"
              />
            }
          >
            <HorizontalList>
              {rewards.map(({ type, label, img }, id) => (
                // eslint-disable-next-line
                <Article key={id} className={type.toLocaleLowerCase()}>
                  <img src={img} alt="" width="32" height="32" />
                  <div>
                    <Text14 bold>
                      {typeof label === 'string' ? (
                        label
                      ) : (
                        <FormattedMessage {...label} />
                      )}
                    </Text14>
                    <ArticleCaption color="var(--c-neutral-600)">
                      <FormattedMessage {...glossary[type]} />
                    </ArticleCaption>
                  </div>
                </Article>
              ))}
            </HorizontalList>
          </Section>
          <Section
            title={
              <FormattedMessage
                id="Football.Home.Public.privateLeagues.title"
                defaultMessage="Play with friends"
              />
            }
            subtitle={
              <FormattedMessage
                id="Football.Home.Public.privateLeagues.subtitle"
                defaultMessage="Compete with your friends and show your football skills"
              />
            }
          >
            <HorizontalList>
              <Article>
                <img src={privateLeague} alt="" width="60" height="60" />
                <div>
                  <Text14>
                    <FormattedMessage
                      id="Football.Home.Public.privateLeagues.privateLeague"
                      defaultMessage="Private League"
                    />
                  </Text14>
                  <ArticleCaption color="var(--c-neutral-600)">
                    <FormattedMessage
                      id="Football.Home.Public.privateLeagues.description"
                      defaultMessage="Create your own League and invite your friends to compete for top spot in the leaderboards"
                    />
                  </ArticleCaption>
                </div>
              </Article>
            </HorizontalList>
          </Section>
        </Root>
      </section>
    </>
  );
};

export default FootballPublicHome;
