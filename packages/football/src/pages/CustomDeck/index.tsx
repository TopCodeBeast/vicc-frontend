import { TypedDocumentNode, gql } from '@apollo/client';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import { faLock } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid } from '@material-ui/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import BackLink from '@sorare/core/src/atoms/buttons/BackLink';
import Button from '@sorare/core/src/atoms/buttons/Button';
import { Container } from '@sorare/core/src/atoms/container';
import Body from '@sorare/core/src/atoms/layout/Body';
import { Caption, Text16, Title2 } from '@sorare/core/src/atoms/typography';
import SocialShare from '@sorare/core/src/components/user/SocialShare';
import User from '@sorare/core/src/components/user/User';
import { FOOTBALL_USER_GALLERY_SQUADS } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import usePaginatedQuery from '@sorare/core/src/hooks/graphql/usePaginatedQuery';
import useInfiniteScroll from '@sorare/core/src/hooks/useInfiniteScroll';
import { sortBy } from '@sorare/core/src/lib/arrays';
import {
  socialShareEventContext,
  socialShareEventName,
} from '@sorare/core/src/lib/events';
import { glossary } from '@sorare/core/src/lib/glossary';

import CardPicker from '@football/components/card/CardPicker';
import FlexCard from '@football/components/card/FlexCard';
import EditableDeckCard from '@football/components/deck/EditableDeckCard';
import { useDeckContext } from '@football/contexts/deck';
import useAddCardsToDeck from '@football/hooks/decks/useAddCardsToDeck';
import useEditCard from '@football/hooks/decks/useEditCard';
import useRemoveCardFromDeck from '@football/hooks/decks/useRemoveCardFromDeck';
import useDragAndDrop from '@football/hooks/useDragAndDrop';

import { CustomDeck_customDeck } from './__generated__/fragments.graphql';
import {
  CustomDeckQuery,
  CustomDeckQueryVariables,
} from './__generated__/index.graphql';
import { deckFragment } from './fragments';

type CustomDeck_customDeck_deckCards_nodes =
  CustomDeck_customDeck['deckCards']['nodes'][number];

const CUSTOM_DECK_QUERY = gql`
  query CustomDeckQuery($deckSlug: String!, $after: String) {
    #football {
      customDeck(slug: $deckSlug) {
        slug
        ...CustomDeck_customDeck
      }
    #}
  }
  ${deckFragment}
` as TypedDocumentNode<CustomDeckQuery, CustomDeckQueryVariables>;

const messages = defineMessages({
  shareTitle: {
    id: 'CustomDeck.shareLink',
    defaultMessage: 'Share your squad',
  },
  shareMessage: {
    id: 'CustomDeck.shareMessage',
    defaultMessage: 'What do you think of my {name} squad on @Vicc?',
  },
  shareOtherMessage: {
    id: 'CustomDeck.shareOtherMessage',
    defaultMessage: "What do you think of {manager}'s {name} squad on @Vicc?",
  },
  createdBy: {
    id: 'CustomDeck.createdBy',
    defaultMessage: 'Created by',
  },
});

const Root = styled.div`
  padding: 20px 0px;
`;
const StyledBackLink = styled.div`
  margin: 10px 0px;
`;
const Header = styled.div`
  margin-bottom: 20px;
`;
const Title = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  margin-bottom: 10px;
`;
const Lock = styled.div`
  background-color: white;
  border-radius: 50%;
  color: var(--c-neutral-600);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;
const Actions = styled.div`
  display: flex;
  flex-grow: 1;
  & > * {
    margin-right: 10px;
  }
`;
const Share = styled.div`
  margin-left: auto;
`;
const Cards = styled(Grid)`
  margin-top: 20px;
`;

export const CustomDeck = () => {
  const { slug: deckSlug = '' } = useParams<{
    slug: string;
  }>();
  const { formatMessage } = useIntlContext();
  const { currentUser } = useCurrentUserContext();
  const navigate = useNavigate();
  const addCards = useAddCardsToDeck();
  const removeCard = useRemoveCardFromDeck();
  const editCard = useEditCard();
  const { editDeck } = useDeckContext();

  const [cardPickerOpened, setCardPickerOpened] = useState(false);
  const { data, loadMore, loading } = usePaginatedQuery(CUSTOM_DECK_QUERY, {
    connection: 'DeckCardConnection',
    variables: {
      deckSlug,
    },
  });
  const addCardsToDeck = useMemo(
    () => addCards(deckSlug),
    [addCards, deckSlug]
  );
  const editCardInDeck = useMemo(
    () => editCard(deckSlug),
    [editCard, deckSlug]
  );
  const removeCardFromDeck = useMemo(
    () => removeCard(deckSlug),
    [removeCard, deckSlug]
  );

  const { dndContextProps, items, setItems, activeId } =
    useDragAndDrop<CustomDeck_customDeck_deckCards_nodes>(
      ({ activeObject, newIndex }) => {
        editCardInDeck!(activeObject.card.slug, newIndex);
      }
    );

  const loadNextPage = useCallback(() => {
    loadMore(false, {
      after: data?.football?.customDeck?.deckCards?.pageInfo.endCursor,
      deckSlug,
    });
  }, [
    loadMore,
    deckSlug,
    data?.football?.customDeck?.deckCards?.pageInfo.endCursor,
  ]);

  const { ref } = useInfiniteScroll(
    loadNextPage,
    Boolean(data?.football?.customDeck?.deckCards?.pageInfo.hasNextPage),
    loading
  );

  const pickCards = useCallback(
    (cards: { objectID: string }[]) => {
      setCardPickerOpened(false);
      addCardsToDeck!(cards.map(c => c.objectID));
    },
    [addCardsToDeck]
  );

  useEffect(
    () =>
      setItems(
        data?.football?.customDeck
          ? sortBy(
              dc => dc.cardIndex!,
              [...data?.football?.customDeck.deckCards.nodes]
            )
          : []
      ),
    [data?.football?.customDeck, setItems]
  );

  if (!data || !items) return null;

  const { customDeck } = data;
  const { slug, name, deckCards, deckCardsCount, user, visible } = customDeck;
  const readOnly = user?.slug !== currentUser?.slug;

  const editCallback = () => {
    navigate(generatePath(FOOTBALL_USER_GALLERY_SQUADS, { slug: user?.slug }));
  };

  return (
    <Body>
      <Root>
        <Container>
          {!readOnly && (
            <CardPicker
              open={cardPickerOpened}
              onClose={() => setCardPickerOpened(false)}
              onConfirm={pickCards}
              excluding={deckCards.nodes.map(dc => dc!.card.slug)}
              filters={[`NOT custom_decks.slug:${slug}`]}
              owner={currentUser!}
            />
          )}
          <StyledBackLink>
            <BackLink>
              <Text16>
                <FormattedMessage {...glossary.back} />
              </Text16>
            </BackLink>
          </StyledBackLink>
          <Header>
            <Title>
              {!visible && (
                <Lock>
                  <FontAwesomeIcon icon={faLock} />
                </Lock>
              )}
              <Title2 color="var(--c-neutral-1000)">{name}</Title2>
              {!readOnly && (
                <Button
                  medium
                  color="darkGray"
                  onClick={() => editDeck(customDeck, editCallback)}
                >
                  <FormattedMessage
                    id="CustomDeck.edit"
                    defaultMessage="Edit"
                  />
                </Button>
              )}
            </Title>
            <Caption color="var(--c-neutral-600)">
              <FormattedMessage
                id="CustomDeck.cardCount"
                defaultMessage="{count, plural, one {# Card} other {# Cards}}"
                values={{ count: deckCardsCount }}
              />
            </Caption>
          </Header>
          <Actions>
            {readOnly ? (
              <User user={user} context={messages.createdBy} />
            ) : (
              <Button
                medium
                color="blue"
                onClick={() => setCardPickerOpened(true)}
                startIcon={<FontAwesomeIcon icon={faPlus} size="xs" />}
              >
                <FormattedMessage
                  id="CustomDeck.addCards"
                  defaultMessage="Add Cards"
                />
              </Button>
            )}
            {visible && (
              <Share>
                <SocialShare
                  url={window.location.href}
                  title={formatMessage(messages.shareTitle)}
                  message={formatMessage(
                    readOnly
                      ? messages.shareOtherMessage
                      : messages.shareMessage,
                    { manager: user?.nickname, name }
                  )}
                  trackingEventName={socialShareEventName.SHARE_SQUAD}
                  trackingEventContext={socialShareEventContext.SQUAD}
                  renderButton={({ ShareButton, label, Icon }) => (
                    <ShareButton medium startIcon={Icon}>
                      {label}
                    </ShareButton>
                  )}
                />
              </Share>
            )}
          </Actions>
          <Cards container spacing={2}>
            <DndContext {...dndContextProps}>
              <SortableContext items={items}>
                {items.map((dc, i) => (
                  <Grid item key={dc.id} xs={6} sm={4} md={3} lg={2}>
                    <EditableDeckCard
                      reorganizable={!readOnly}
                      deckCard={dc}
                      removeCard={() => {
                        removeCardFromDeck(dc.card.slug);
                      }}
                      readOnly={readOnly}
                      ref={i === deckCards.nodes.length - 1 ? ref : undefined}
                    />
                  </Grid>
                ))}
              </SortableContext>
              <DragOverlay>
                {activeId ? (
                  <FlexCard card={activeId.card} draggableProps={{}} />
                ) : null}
              </DragOverlay>
            </DndContext>
          </Cards>
        </Container>
      </Root>
    </Body>
  );
};

CustomDeck.fragments = { deck: deckFragment };

export default CustomDeck;
