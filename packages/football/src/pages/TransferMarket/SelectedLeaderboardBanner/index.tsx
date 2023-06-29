import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Title4 } from '@sorare/core/src/atoms/typography';
import { FOOTBALL_COMPETITION_DETAILS } from '@sorare/core/src/constants/routes';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { useGeneratePathWithSearch } from '@sorare/core/src/hooks/useGeneratePathWithSearch';
import { Link } from '@sorare/core/src/routing/Link';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import DivisionLogo from '@football/components/so5/DivisionLogo';
import { MissingCardsMessage } from '@football/components/unlockCompetition/MissingCardsMessage';

import {
  MarketLeaderboardQuery,
  MarketLeaderboardQueryVariables,
} from './__generated__/index.graphql';

const StyledLink = styled(Link)`
  display: grid;
  grid-template-areas:
    'logo overline'
    'logo title';
  grid-template-columns: max-content 1fr;
  column-gap: var(--double-unit);
  padding: var(--double-unit);
  border: 1px solid var(--c-neutral-300);
  background-color: var(--c-neutral-200);
  border-radius: var(--double-unit);
  align-items: center;
  &,
  &:hover,
  &:focus {
    color: var(--c-neutral-1000);
  }
  @media ${laptopAndAbove} {
    grid-template-areas:
      'logo overline cta'
      'logo title cta';
    column-gap: var(--double-unit);
    grid-template-columns: max-content 1fr max-content;
  }
`;
const DivisionLogoWrapper = styled.div`
  grid-area: logo;
`;
const Overline = styled.p`
  font: var(--t-14-16);
  grid-area: overline;
  .dark-theme & {
    color: var(--c-neutral-700);
  }
`;
const Title = styled(Title4)`
  grid-area: title;
`;
const StyledButton = styled(Button)`
  display: none;
  @media ${laptopAndAbove} {
    display: flex;
    grid-area: cta;
  }
`;

const MARKET_LEADERBOARD_QUERY = gql`
  query MarketLeaderboardQuery($slug: String!) {
    football {
      so5 {
        so5Leaderboard(slug: $slug) {
          slug
          displayName
          canCompose {
            ...MissingCardsMessage_validity
          }
          ...DivisionLogo_so5Leaderboard
        }
      }
    }
  }
  ${DivisionLogo.fragments.so5Leaderboard}
  ${MissingCardsMessage.fragments.validity}
`;

export const SelectedLeaderboardBanner = () => {
  const [searchParams] = useSearchParams();
  const leaderboardSlug = searchParams.get('leaderboard');
  const generatePathWithSearch = useGeneratePathWithSearch();

  const { data } = useQuery<
    MarketLeaderboardQuery,
    MarketLeaderboardQueryVariables
  >(MARKET_LEADERBOARD_QUERY, {
    variables: { slug: leaderboardSlug || '' },
    skip: !leaderboardSlug,
  });

  if (!data) return null;

  const { so5Leaderboard } = data.football.so5;
  return (
    <StyledLink
      to={generatePathWithSearch(FOOTBALL_COMPETITION_DETAILS, {
        competition: so5Leaderboard.slug,
        tab: 'details',
      })}
    >
      <DivisionLogoWrapper>
        <DivisionLogo so5Leaderboard={so5Leaderboard} />
      </DivisionLogoWrapper>
      <Overline>{so5Leaderboard.displayName}</Overline>
      <Title>
        <MissingCardsMessage validity={so5Leaderboard.canCompose} />
      </Title>
      <StyledButton component="div" color="white" medium>
        <FormattedMessage
          id="TransferMarket.NewSignings.RecommendedLeaderboardBanner.Cta"
          defaultMessage="Competition requirements"
        />
      </StyledButton>
    </StyledLink>
  );
};
