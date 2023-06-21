import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Title3 } from '@sorare/core/src/atoms/typography';
import { FOOTBALL_LOBBY_UPCOMING } from '@sorare/core/src/constants/routes';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  align-items: center;
  padding: var(--quadruple-unit) 0;
  background-color: var(--c-neutral-200);
  border-radius: var(--double-unit);
`;

const EmptyState = () => {
  return (
    <Root>
      <Title3 color="var(--c-neutral-1000)">
        <FormattedMessage
          id="ClubHonors.EmptyState.title"
          defaultMessage="You don't have any trophies yet"
        />
      </Title3>
      <Button color="blue" component={Link} to={FOOTBALL_LOBBY_UPCOMING} medium>
        <FormattedMessage
          id="ClubHonors.EmptyState.cta"
          defaultMessage="Play"
        />
      </Button>
    </Root>
  );
};

export default EmptyState;
