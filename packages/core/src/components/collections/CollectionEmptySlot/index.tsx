import { faSearch } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const StyledButton = styled(Button).attrs({
  color: 'white',
  small: true,
  component: Link,
})`
  align-self: center;
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;

export type Props = {
  cardRoute: string;
  placeholderCard: ReactNode;
  showFind: boolean;
};
export const CollectionEmptySlot = ({
  cardRoute,
  placeholderCard,
  showFind,
}: Props) => {
  if (!placeholderCard) return null;

  return (
    <Container>
      <Link to={cardRoute}>{placeholderCard}</Link>
      {showFind && (
        <StyledButton to={cardRoute}>
          <ButtonContent>
            <FontAwesomeIcon icon={faSearch} size="xs" />
            <FormattedMessage
              id="CollectionEmptySlot.marketCta"
              defaultMessage="Find"
            />
          </ButtonContent>
        </StyledButton>
      )}
    </Container>
  );
};
