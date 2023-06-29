import { gql } from '@apollo/client';
import { faLock, faPen } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fab } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import ButtonBase from '@sorare/core/src/atoms/buttons/ButtonBase';
import { Text16, Title6 } from '@sorare/core/src/atoms/typography';
import { FOOTBALL_CUSTOM_DECK_SHOW } from '@sorare/core/src/constants/routes';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import FlexCard from '@football/components/card/FlexCard';
import { useDeckContext } from '@football/contexts/deck';

import { CustomDeckPreview_customDeck } from './__generated__/index.graphql';

interface Props {
  customDeck: CustomDeckPreview_customDeck;
  readOnly: boolean;
}

const Root = styled(ButtonBase)`
  border-radius: 8px;
  border: 1px solid var(--c-neutral-300);
  display: block;
  width: 100%;
  padding: 20px;
  overflow: hidden;
  box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.05);
  .dark-theme & {
    background-color: var(--c-neutral-200);
  }
  &:hover {
    box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.06);
  }
`;
const Cover = styled.div`
  position: relative;
  display: flex;
`;
const Main = styled.div`
  width: 68%;
  margin-right: 20px;
`;
const EmptyCard = styled.div`
  background-color: var(--c-neutral-200);
  .dark-theme & {
    background-color: var(--c-neutral-300);
  }
`;
const SecondaryContainer = styled.div`
  width: 32%;
`;
const Secondary = styled.div`
  &:not(:last-child) {
    margin-bottom: 20px;
  }
`;
const Locked = styled(Fab)`
  position: absolute;
  bottom: 10px;
  left: 10px;
  &.Mui-disabled {
    color: var(--c-neutral-1000);
  }
`;
const Edit = styled(Fab)`
  @media ${laptopAndAbove} {
    opacity: 0;
  }
  ${Root}:hover & {
    opacity: 1;
  }
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: var(--c-brand-600);
`;
const Bottom = styled.div`
  text-align: left;
  padding: 20px 20px 0px 0px;
`;

export const CustomDeckPreview = (props: Props) => {
  const { customDeck, readOnly } = props;
  const { editDeck } = useDeckContext();

  const { slug, name, deckCardsForPreview, visible, deckCardsCount } =
    customDeck;
  const [mainCard, secondCard, thirdCard] = deckCardsForPreview.nodes;

  return (
    <Root
      component={Link}
      to={generatePath(FOOTBALL_CUSTOM_DECK_SHOW, { slug })}
    >
      <Cover>
        <Main className="card-ratio">
          {mainCard ? (
            <FlexCard card={mainCard.card} />
          ) : (
            <EmptyCard className="card-ratio" />
          )}
        </Main>
        <SecondaryContainer>
          {[secondCard, thirdCard].map((deckCard, i) => (
            <Secondary key={deckCard?.id || i} className="card-ratio">
              {deckCard ? (
                <FlexCard card={deckCard.card} />
              ) : (
                <EmptyCard className="card-ratio" />
              )}
            </Secondary>
          ))}
        </SecondaryContainer>
        {!visible && (
          <Locked disabled>
            <FontAwesomeIcon icon={faLock} />
          </Locked>
        )}
        {!readOnly && (
          <Edit
            onClick={event => {
              event.stopPropagation();
              event.preventDefault();
              editDeck(customDeck);
            }}
          >
            <FontAwesomeIcon icon={faPen} />
          </Edit>
        )}
      </Cover>
      <Bottom>
        <Title6 color="var(--c-neutral-1000)">{name}</Title6>
        <Text16 color="var(--c-neutral-600)">
          <FormattedMessage
            id="CustomDeckPreview.cardCount"
            defaultMessage="{count, plural, one {# Card} other {# Cards}}"
            values={{ count: deckCardsCount }}
          />
        </Text16>
      </Bottom>
    </Root>
  );
};

CustomDeckPreview.fragments = {
  customDeck: gql`
    fragment CustomDeckPreview_customDeck on CustomDeck {
      id
      slug
      name
      visible
      deckCardsCount
      deckCardsForPreview: deckCards(first: 3) {
        nodes {
          id
          card {
            slug
            assetId
            ...FlexCard_card
          }
          label
        }
      }
    }
    ${FlexCard.fragments.card}
  `,
};

export default CustomDeckPreview;
