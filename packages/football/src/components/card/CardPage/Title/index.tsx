import { TypedDocumentNode, gql } from '@apollo/client';
import {
  faArrowUp,
  faEllipsis,
  faPlus,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { generatePath } from 'react-router-dom';
import { animated, useSpring } from '@react-spring/web';
import styled from 'styled-components';

import ButtonBase from '@sorare/core/src/atoms/buttons/ButtonBase';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import Dropdown from '@sorare/core/src/atoms/dropdowns/Dropdown';
import SmartDropdown, {
  Item,
  ItemText,
} from '@sorare/core/src/atoms/dropdowns/SmartDropdown';
import { Caption } from '@sorare/core/src/atoms/typography';
import FavoriteHeartButton from '@sorare/core/src/components/favorites/FavoriteHeartButton';
import SocialShare from '@sorare/core/src/components/user/SocialShare';
import { FOOTBALL_CARD_SHOW } from '@sorare/core/src/constants/routes';
import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import {
  socialShareEventContext,
  socialShareEventName,
} from '@sorare/core/src/lib/events';
import { useUseCustomLists } from '@sorare/core/src/lib/featureFlags';
import { glossary } from '@sorare/core/src/lib/glossary';
import { isType } from '@sorare/core/src/lib/gql';

import Boosts from '@football/components/card/CardPage/Boosts';
import CardTitle from '@football/components/card/CardTitle';
import { socialSharingMessages } from '@football/lib/so5';

import CardLevelPreview from './CardLevelPreview';
import { CardPageTitle_card } from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
`;
const LevelPreviewContainer = styled.div`
  flex: 1;
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const GaugeContainer = styled.div`
  display: flex;
  gap: var(--double-unit);
  align-items: center;
`;
const FlexContainer = styled.div`
  display: flex;
  gap: var(--half-unit);
  align-items: center;
`;
const BoostsButton = styled(ButtonBase)`
  box-sizing: border-box;
  border: 2px solid transparent;
  border-radius: var(--triple-unit);
  padding: var(--half-unit) var(--unit);
  background: linear-gradient(0deg, var(--c-neutral-200), var(--c-neutral-200))
      padding-box,
    linear-gradient(
        92.13deg,
        #ffffff 0%,
        #eabfe2 28.88%,
        #ffffff 48.67%,
        #bedecb 64.58%,
        #ffffff 100%
      )
      border-box;
  text-transform: uppercase;
`;
const GradientOverlay = styled(Caption)`
  background-color: var(--c-neutral-1000);
  /* stylelint-disable-next-line declaration-block-no-shorthand-property-overrides */
  background: linear-gradient(
    92.13deg,
    #ffffff 0%,
    #eabfe2 28.88%,
    #ffffff 48.67%,
    #bedecb 64.58%,
    #ffffff 100%
  );
  background-size: 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
`;
const LevelUpCounterWrapper = styled(animated.div)`
  display: flex;
  gap: var(--half-unit);
`;

type Props = {
  card: CardPageTitle_card;
  loading?: boolean;
  onAddToListClick: () => void;
};
export const Title = ({ card, loading, onAddToListClick }: Props) => {
  const {
    flags: { displayLevelUpUsed = false },
  } = useFeatureFlags();
  const useCustomLists = useUseCustomLists();
  const { currentUser } = useCurrentUserContext();
  const [allLevelUpUsed, setAllLevelUpUsed] = useState(false);
  const { formatMessage } = useIntl();

  const styles = useSpring({
    from: { x: 0 },
    to: { x: allLevelUpUsed ? 1 : 0 },
    config: { duration: 200 },
    reset: true,
    onRest: () => setAllLevelUpUsed(false),
  });

  const { levelUpAppliedCount, maxLevelUpAppliedCount } = card;
  const isMyCard = card.user?.slug && card.user?.slug === currentUser?.slug;

  const hasLevelUp = card.availableCardBoosts.some(({ shopItem }) =>
    isType(shopItem, 'LevelUpShopItem')
  );

  const cardUrl = `${window.location.origin}${generatePath(FOOTBALL_CARD_SHOW, {
    slug: card.slug,
  })}`;

  return (
    <Root>
      <Row>
        <CardTitle card={card} />
        <FlexContainer>
          <FlexContainer>
            <SmartDropdown
              align="right"
              gap={4}
              label={
                <IconButton
                  disableDebounce
                  color="white"
                  icon={faEllipsis}
                  small
                />
              }
            >
              {({ closeDropdown }) => (
                <SocialShare
                  image={{
                    post: card.pictureUrlForTwitter,
                    square: null,
                    story: null,
                  }}
                  url={cardUrl}
                  message={formatMessage(socialSharingMessages.card)}
                  trackingEventName={socialShareEventName.SHARE_CARD}
                  trackingEventContext={socialShareEventContext.CARD_PAGE}
                  renderButton={({ onClick, Icon, icon }) =>
                    closeDropdown ? (
                      <Item
                        type="button"
                        onClick={() => {
                          onClick();
                          closeDropdown?.();
                        }}
                        disabled={loading}
                      >
                        <ItemText>
                          <FormattedMessage {...glossary.share} />
                        </ItemText>
                        {Icon}
                      </Item>
                    ) : (
                      <IconButton
                        small
                        color="white"
                        onClick={onClick}
                        disabled={loading}
                        icon={icon}
                      />
                    )
                  }
                />
              )}
              {useCustomLists &&
                currentUser &&
                currentUser.slug === card.user?.slug &&
                (({ closeDropdown }) => (
                  <Item
                    onClick={() => {
                      onAddToListClick();
                      closeDropdown?.();
                    }}
                    disabled={loading}
                    type="button"
                  >
                    <ItemText>
                      <FormattedMessage
                        id="CardPage.addToList"
                        defaultMessage="Add to list"
                      />
                    </ItemText>
                    <FontAwesomeIcon icon={faPlus} size="sm" />
                  </Item>
                ))}
            </SmartDropdown>
          </FlexContainer>
          <FavoriteHeartButton subscribable={card} />
        </FlexContainer>
      </Row>
      <GaugeContainer>
        <LevelPreviewContainer>
          <CardLevelPreview card={card} />
        </LevelPreviewContainer>
        {isMyCard && hasLevelUp && (
          <Dropdown
            darkTheme
            align="right"
            label={
              <BoostsButton disableDebounce>
                <FlexContainer>
                  <FontAwesomeIcon icon={faArrowUp} size="xs" />
                  <GradientOverlay color="var(--c-neutral-1000)" bold>
                    <FormattedMessage
                      id="CardPage.Title.Boosts"
                      defaultMessage="Boost"
                    />
                  </GradientOverlay>
                </FlexContainer>
              </BoostsButton>
            }
            gap={16}
          >
            {({ closeDropdown }) => (
              <Boosts
                card={card}
                onMaxLevelUpAppliedCountReached={() => setAllLevelUpUsed(true)}
                closeDropdown={closeDropdown}
              />
            )}
          </Dropdown>
        )}
      </GaugeContainer>
      {displayLevelUpUsed && (
        <LevelUpCounterWrapper
          style={{
            transform: styles.x
              .to([0, 0.25, 0.5, 0.75, 1], [0, 10, -10, 10, 0])
              .to(x => `translateX(${x}px)`),
          }}
        >
          <Caption bold>
            {levelUpAppliedCount}/{maxLevelUpAppliedCount}
          </Caption>
          <Caption>
            <FormattedMessage
              id="Title.LevelUpCount"
              defaultMessage="Level Up Boosts applied"
            />
          </Caption>
        </LevelUpCounterWrapper>
      )}
    </Root>
  );
};

Title.fragments = {
  card: gql`
    fragment CardPageTitle_card on Card {
      slug
      assetId
      xp
      grade
      xpNeededForNextGrade
      xpNeededForCurrentGrade
      levelUpAppliedCount
      maxLevelUpAppliedCount
      pictureUrlForTwitter: pictureUrl(derivative: "twitter")
      user {
        slug
      }
      availableCardBoosts {
        # shopItem does not expose an ID because it's a union type
        # eslint-disable-next-line sorare/enforce-apollo-typepolicies
        shopItem {
          ... on ShopItemInterface {
            id
          }
        }
      }
      ...CardTitle_card
      ...Boosts_card
    }
    ${CardTitle.fragments.card}
    ${Boosts.fragments.card}
  ` as TypedDocumentNode<CardPageTitle_card>,
};

export default Title;
