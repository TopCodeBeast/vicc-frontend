import { gql } from '@apollo/client';
import { FormattedMessage } from 'react-intl';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import Block from '@sorare/core/src/atoms/layout/Block';
import { Text14 } from '@sorare/core/src/atoms/typography';
import FlagAvatar from '@sorare/core/src/components/country/FlagAvatar';
import {
  FOOTBALL_CLUB_SHOW,
  FOOTBALL_COUNTRY_SHOW,
} from '@sorare/core/src/constants/routes';
import { isType } from '@sorare/core/src/gql';
import { cardAttributes } from '@sorare/core/src/lib/glossary';
import {
  attributes as playerAttributes,
  positionNames,
} from '@sorare/core/src/lib/players';
import { toDisplayName } from '@sorare/core/src/lib/territories';

import TeamAvatar from '@football/components/club/TeamAvatar';

import { CardAttributes_card } from './__generated__/index.graphql';

interface Props {
  card: CardAttributes_card;
}

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`;
const BlockContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;
const Title = styled(Text14)`
  color: var(--c-neutral-600);
`;
const TeamRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  color: var(--c-neutral-1000);
`;

export const CardAttributes = ({ card }: Props) => {
  const { team, positionTyped, age, player, xp } = card;
  const { country } = player;
  const isClub = isType(team, 'Club');

  return (
    <Block>
      <BlockContent>
        <Row>
          <Title>
            <FormattedMessage {...cardAttributes.team} />
          </Title>
          <TeamRow
            as={isClub ? Link : 'div'}
            to={
              isClub
                ? generatePath(FOOTBALL_CLUB_SHOW, { slug: team.slug })
                : undefined
            }
          >
            <TeamAvatar team={team} size={16} />
            <Text14>{team.name}</Text14>
          </TeamRow>
        </Row>
        <Row>
          <Title>
            <FormattedMessage {...cardAttributes.position} />
          </Title>
          <Text14>
            <FormattedMessage {...positionNames[positionTyped]} />
          </Text14>
        </Row>
        <Row>
          <Title>
            <FormattedMessage {...cardAttributes.age} />
          </Title>
          <Text14>{age}</Text14>
        </Row>
        <Row>
          <Title>
            <FormattedMessage {...playerAttributes.country} />
          </Title>
          <TeamRow
            as={Link}
            to={generatePath(FOOTBALL_COUNTRY_SHOW, { slug: country.slug })}
          >
            <FlagAvatar country={country} imageRes={64} size={16} />
            <Text14>{toDisplayName(country.code)}</Text14>
          </TeamRow>
        </Row>
        <Row>
          <Title>
            <FormattedMessage {...cardAttributes.xpTitle} />
          </Title>
          <Text14>
            <FormattedMessage {...cardAttributes.xpValue} values={{ xp }} />
          </Text14>
        </Row>
      </BlockContent>
    </Block>
  );
};

CardAttributes.fragments = {
  card: gql`
    fragment CardAttributes_card on Card {
      slug
      assetId
      positionTyped: position
      age
      xp
      player {
        slug
        country {
          code
          slug
        }
      }
      team {
        ... on TeamInterface {
          slug
          code
          name
        }
        ...TeamAvatar_team
      }
    }
    ${TeamAvatar.fragments.team}
  `,
};

export default CardAttributes;
