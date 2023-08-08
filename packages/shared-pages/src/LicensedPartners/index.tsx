import { TypedDocumentNode, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { generatePath, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { AnimatedNumber } from '@sorare/core/src/atoms/animations/AnimatedNumber';
import { text16, text20 } from '@sorare/core/src/atoms/typography';
import MarketingPage from '@sorare/core/src/components/marketing/MarketingPage';
import { LICENSED_PARTNERS_BY_SPORT } from '@sorare/core/src/constants/routes';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { useTitleAndDescription } from '@sorare/core/src/hooks/useTitleAndDescription';
import { MLBTeams } from '@sorare/core/src/lib/mlbTeams';
import { NBATeams } from '@sorare/core/src/lib/nbaTeams';
import { metadatas } from '@sorare/core/src/lib/seo/common';
import MultiSportAppBar from '@sorare/core/src/routing/MultiSportAppBar';
import MultiSportFooter from '@sorare/core/src/routing/MultiSportFooter';
import {
  desktopAndAbove,
  tabletAndAbove,
} from '@sorare/core/src/style/mediaQuery';

import { PartnersList } from './PartnersList';
import { StyledTabs } from './StyledTabs';
import {
  LicensedClubsQuery,
  LicensedClubsQueryVariables,
} from './__generated__/index.graphql';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Count = styled.span`
  font-family: Romie-Italic, serif;
  font-style: italic;
  font-size: clamp(10rem, 30vw, 20rem);
  margin-bottom: -4%;
`;

const Licensed = styled.span`
  font-family: Romie-Italic, serif;
  font-style: italic;
  font-size: clamp(2rem, 10vw, 5rem);
  color: var(--c-brand-300);
`;

const Teams = styled.span`
  font-family: Druk Wide, sans-serif;
  font-size: clamp(2rem, 6vw, 4rem);
  text-transform: uppercase;
`;

const LicensedTeams = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media ${tabletAndAbove} {
    align-items: baseline;
    flex-direction: row;
    gap: var(--double-unit);
  }
  & > *:first-child {
    margin-bottom: calc(-2 * var(--unit));
  }
`;

const Subtitle = styled.div`
  color: var(--c-neutral-600);
  text-align: center;
  padding: var(--quadruple-unit) 0;
  width: 80%;
  ${text16} @media ${tabletAndAbove} {
    ${text20}
    width: 70%;
  }
  @media ${desktopAndAbove} {
    width: 50%;
  }
`;

const TabsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-bottom: var(--quadruple-unit);
`;

const Footer = styled(MultiSportFooter)`
  position: sticky;
  top: 100%;
`;

const LICENSED_CLUBS_QUERY = gql`
  query LicensedClubsQuery {
    football {
      clubsReady {
        slug
        ...PartnersList_club
      }
    }
  }
  ${PartnersList.fragments.club}
` as TypedDocumentNode<LicensedClubsQuery, LicensedClubsQueryVariables>;

const LicensedPartners = () => {
  useTitleAndDescription(
    metadatas.licensedPartners.title,
    metadatas.licensedPartners.description
  );

  const { data, loading } = useQuery(LICENSED_CLUBS_QUERY);
  const [displayedCount, setDisplayedCount] = useState(0);
  const { sport, tab } = useParams();

  useEffect(() => {
    setTimeout(() => {
      setDisplayedCount(
        (data?.football.clubsReady.length || 0) +
          MLBTeams.length +
          NBATeams.length
      );
    }, 0);
  }, [data?.football.clubsReady.length]);
  return (
    <MarketingPage>
      <MultiSportAppBar />
      <PartnersList
        footballClubs={data?.football.clubsReady}
        sport={sport}
        tab={tab}
        loading={loading}
        header={
          <Header>
            <Wrapper>
              <FormattedMessage
                id="LicensedPartners.title"
                defaultMessage="<a>{count}</a><d><b>licensed</b><c>teams</c></d>"
                values={{
                  count: loading ? (
                    '300+'
                  ) : (
                    <AnimatedNumber value={displayedCount} />
                  ),
                  a: (text: string) => <Count>{text}</Count>,
                  b: (text: string) => <Licensed>{text}</Licensed>,
                  c: (text: string) => <Teams>{text}</Teams>,
                  d: (text: string) => <LicensedTeams>{text}</LicensedTeams>,
                }}
              />
            </Wrapper>
            <Subtitle>
              <FormattedMessage
                id="LicensedPartners.subtitle"
                defaultMessage="We have partnered with the best sports leagues and clubs in the world to bring our next-level fantasy sports game to fans across the globe"
              />
            </Subtitle>
            <TabsWrapper>
              <StyledTabs
                items={[
                  {
                    label: 'Football',
                    to: generatePath(LICENSED_PARTNERS_BY_SPORT, {
                      sport: 'football',
                    }),
                  },
                  {
                    label: 'NBA',
                    to: generatePath(LICENSED_PARTNERS_BY_SPORT, {
                      sport: 'nba',
                    }),
                  },
                  {
                    label: 'MLB',
                    to: generatePath(LICENSED_PARTNERS_BY_SPORT, {
                      sport: 'mlb',
                    }),
                  },
                ]}
              />
            </TabsWrapper>
          </Header>
        }
        footer={<Footer />}
      />
    </MarketingPage>
  );
};

export default LicensedPartners;
