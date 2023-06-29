import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import PatternBg from '@sorare/core/src/assets/backgrounds/pattern-bg.svg';
import Button from '@sorare/core/src/atoms/buttons/Button';
import { Title2 } from '@sorare/core/src/atoms/typography';
import { goToLobby } from '@sorare/core/src/constants/routes';
import useLocalStorage, {
  STORAGE,
} from '@sorare/core/src/hooks/useLocalStorage';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import { SortAndFiltersType } from '@football/pages/Lobby/Components/CompetitionList/SortAndFilters';

import { ComposeTeamReminderBanner_so5Fixture } from './__generated__/index.graphql';

const Root = styled.div`
  display: grid;
  grid-template-areas:
    'title title'
    'cta time';
  align-items: center;
  gap: var(--double-unit);
  padding: var(--double-unit);
  margin-bottom: var(--double-unit);
  border-radius: var(--double-unit);
  background: linear-gradient(
      rgba(var(--c-static-rgb-neutral-1000), 0.96) 0%,
      rgba(var(--c-static-rgb-neutral-800), 0.96) 100%
    ),
    url(${PatternBg}) center / 300px repeat, var(--c-static-neutral-100);
  color: var(--c-static-neutral-100);
  overflow: hidden;

  @media ${laptopAndAbove} {
    grid-template-areas:
      'title time'
      'cta .';
  }
`;
const Title = styled(Title2)`
  grid-area: title;
`;
const ButtonContainer = styled.div`
  grid-area: cta;
`;

type Props = {
  so5Fixture?: ComposeTeamReminderBanner_so5Fixture | null;
};

const ComposeTeamReminderBanner = ({ so5Fixture }: Props) => {
  const [, setSortAndFilters] = useLocalStorage<SortAndFiltersType>(
    STORAGE.lobby.sortFilterPreference,
    {
      filter: { showRecommended: true },
    }
  );

  if (!so5Fixture) {
    return null;
  }

  const { displayName } = so5Fixture;

  return (
    <Root>
      <Title>
        <FormattedMessage
          id="lobby.live.myTeams.composeTeamReminderBanner.text.edit"
          defaultMessage="Get ready for {displayName}"
          values={{ displayName }}
        />
      </Title>
      <ButtonContainer>
        <Button
          component={Link}
          medium
          color="blue"
          to={goToLobby('upcoming')}
          onClick={() =>
            setSortAndFilters(prev => ({
              ...prev,
              filter: { showRecommended: true },
            }))
          }
        >
          <FormattedMessage
            id="lobby.live.myTeams.composeTeamReminderBanner.cta.default"
            defaultMessage="Submit Team"
          />
        </Button>
      </ButtonContainer>
    </Root>
  );
};

ComposeTeamReminderBanner.fragments = {
  so5Fixture: gql`
    fragment ComposeTeamReminderBanner_so5Fixture on So5Fixture {
      slug
      displayName
    }
  `,
};

export default ComposeTeamReminderBanner;
