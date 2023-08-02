import { TypedDocumentNode, gql } from '@apollo/client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { faMinus, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fab } from '@material-ui/core';
import classnames from 'classnames';
import { forwardRef } from 'react';
import styled from 'styled-components';

import ButtonBase from '@sorare/core/src/atoms/buttons/ButtonBase';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import FlexCard from '@football/components/card/FlexCard';

import { EditableDeckCard_deckCard } from './__generated__/index.graphql';

interface Props {
  deckCard?: EditableDeckCard_deckCard;
  removeCard?: () => void;
  addCard?: () => void;
  readOnly?: boolean;
  reorganizable?: boolean;
}

const Root = styled.div`
  position: relative;
  flex-grow: 1;

  &.isDragging {
    opacity: 0;
  }
`;
const RemoveCard = styled(Fab)`
  position: absolute;
  color: white;
  background: var(--c-red-600);
  right: 5px;
  bottom: 5px;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  &:hover {
    background: var(--c-red-600);
  }
  ${Root}:hover & {
    opacity: 1;
  }
  @media ${laptopAndAbove} {
    opacity: 0;
  }
`;
const EmptyRoot = styled(ButtonBase)`
  flex-grow: 1;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

export const EditableDeckCard = forwardRef<HTMLDivElement, Props>(
  (props, infiniteLoadRef) => {
    const { deckCard, removeCard, addCard, readOnly, reorganizable } = props;
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: deckCard?.id || '',
      disabled: !reorganizable,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition: transition!,
    };

    if (deckCard) {
      return (
        <Root
          className={classnames({ reorganizable, isDragging })}
          ref={setNodeRef}
          style={style}
        >
          <FlexCard
            card={deckCard.card}
            withLink
            ref={infiniteLoadRef}
            draggableProps={
              reorganizable ? { ...attributes, ...listeners } : undefined
            }
          />
          {!readOnly && (
            <RemoveCard onClick={removeCard} size="small">
              <FontAwesomeIcon icon={faMinus} />
            </RemoveCard>
          )}
        </Root>
      );
    }

    return (
      <EmptyRoot
        onClick={addCard}
        className="card-ratio"
        innerRef={infiniteLoadRef}
      >
        <FontAwesomeIcon icon={faPlus} />
      </EmptyRoot>
    );
  }
);

EditableDeckCard.displayName = 'EditableDeckCard';

EditableDeckCard.fragments = {
  deckCard: gql`
    fragment EditableDeckCard_deckCard on DeckCard {
      id
      cardIndex
      card {
        slug
        assetId
        ...FlexCard_card
      }
    }
    ${FlexCard.fragments.card}
  ` as TypedDocumentNode<EditableDeckCard_deckCard>,
};

export default EditableDeckCard;
