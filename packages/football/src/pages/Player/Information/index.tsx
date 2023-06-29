import { gql } from '@apollo/client';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Position } from '@sorare/core/src/__generated__/globalTypes';
import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import FlagAvatar from '@sorare/core/src/components/country/FlagAvatar';
import { FOOTBALL_COUNTRY_SHOW } from '@sorare/core/src/constants/routes';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import { positionShortNames } from '@football/lib/so5';

import { Information_player } from './__generated__/index.graphql';

type Props = {
  player: Information_player;
};

const renderShirtNumber = (shirtNumber?: number | null) => {
  return shirtNumber ? ` #${shirtNumber}` : '';
};

const Meta = styled.h6`
  font-size: inherit;
`;

const Root = styled.div`
  display: flex;
  color: rgba(var(--c-static-rgb-neutral-100), 0.6);
  align-items: center;
  justify-content: center;
  font-weight: 700;
  gap: 10px;
  @media ${tabletAndAbove} {
    justify-content: flex-start;
  }
`;
const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Country = styled(Link)`
  color: inherit;
  &:hover {
    color: var(--c-static-neutral-100);
  }
`;

const Information = ({ player }: Props) => {
  const { formatMessage } = useIntlContext();

  const { age, position, shirtNumber, birthDate } = player;

  return (
    <Root>
      <Container>
        <Tooltip
          title={
            <FormattedDate
              value={birthDate || undefined}
              year="numeric"
              month="numeric"
              day="numeric"
            />
          }
        >
          <Meta>
            <FormattedMessage
              id="PlayerInformation.age"
              defaultMessage="{age} Years old"
              values={{ age }}
            />
          </Meta>
        </Tooltip>
        {position && (
          <Meta>
            {[
              `${formatMessage(
                positionShortNames[position as Position]
              )}${renderShirtNumber(shirtNumber)}`,
            ]
              .filter(Boolean)
              .join(' ')}
          </Meta>
        )}
      </Container>
      <Country
        to={generatePath(FOOTBALL_COUNTRY_SHOW, { slug: player.country.slug })}
      >
        <FlagAvatar
          country={player.country}
          imageRes={64}
          type="flat"
          withCountryCode
        />
      </Country>
    </Root>
  );
};

Information.fragments = {
  player: gql`
    fragment Information_player on Player {
      slug
      age
      position: positionTyped
      shirtNumber
      birthDate
      country {
        slug
      }
    }
  `,
};

export default Information;
