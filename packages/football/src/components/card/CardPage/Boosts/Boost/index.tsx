import { TypedDocumentNode, gql } from '@apollo/client';
import { faArrowUp, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import ButtonBase from '@sorare/core/src/atoms/buttons/ButtonBase';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { Caption, Text16 } from '@sorare/core/src/atoms/typography';
import { isType } from '@sorare/core/src/lib/gql';

import { ItemPreviewDialog } from '@football/components/shopItems/ShopItemPicker/ItemPreviewDialog';

import { Boost_cardBoost } from './__generated__/index.graphql';
import useConsumeCardBoost from './useConsumeCardBoost';

const Root = styled(ButtonBase)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--unit);
  &.loading {
    transform: scale(0.9);
  }
  transition: transform 0.3s ease-out;
`;
const ImageContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  border: 2px solid var(--c-neutral-400);
  width: 64px;
  height: 64px;
`;
const Plus = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 100%;
  background-color: var(--c-brand-600);
`;
const BoostImage = styled.img`
  width: 32px;
  height: 32px;
  &.greyedOut {
    opacity: 0.5;
  }
`;
const Count = styled(Caption)`
  position: absolute;
  bottom: -10px;
  border-radius: 6px;
  border: 2px solid var(--c-neutral-300);
  padding: 0 var(--half-unit);
  background-color: var(--c-brand-600);
  &.greyedOut {
    background-color: var(--c-neutral-400);
  }
`;
const Label = styled(Text16)`
  display: flex;
  gap: var(--half-unit);
  align-items: center;
`;

type Props = {
  cardId: string;
  cardBoost: Boost_cardBoost;
  maxLevelUpAppliedCountReached?: boolean;
  onMaxLevelUpAppliedCountReached: () => void;
  closeDropdown: () => void;
};
const Boost = ({
  cardId,
  cardBoost,
  maxLevelUpAppliedCountReached,
  onMaxLevelUpAppliedCountReached,
  closeDropdown,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const consumeCardBoost = useConsumeCardBoost();

  const item = cardBoost.shopItem;
  const { name, pictureUrl } = item;
  const userShopItems = item.myAvailableUserShopItems;
  const itemCount = userShopItems?.length || 0;

  const greyedOut = maxLevelUpAppliedCountReached || itemCount === 0;

  const onClick = async () => {
    setLoading(true);
    if (maxLevelUpAppliedCountReached) {
      onMaxLevelUpAppliedCountReached();
    } else if (itemCount === 0) {
      setShowBuyDialog(true);
    } else {
      await consumeCardBoost({
        cardId,
        userShopItemId: userShopItems![0].id,
      });
    }
    closeDropdown();
    setLoading(false);
  };

  const onDialogClose = () => setShowBuyDialog(false);

  return (
    <>
      <Root
        onClick={onClick}
        className={classnames({ loading })}
        disabled={loading}
        disableRipple
      >
        <ImageContainer>
          {loading ? (
            <LoadingIndicator small />
          ) : (
            <>
              {itemCount === 0 && !maxLevelUpAppliedCountReached && (
                <Plus>
                  <FontAwesomeIcon
                    color="var(--c-neutral-1000)"
                    icon={faPlus}
                    size="sm"
                  />
                </Plus>
              )}
              <BoostImage
                className={classnames({
                  greyedOut,
                })}
                src={pictureUrl}
                alt={name}
              />
              <Count
                className={classnames({
                  greyedOut,
                })}
                color="var(--c-neutral-1000)"
                bold
              >
                x{itemCount}
              </Count>
            </>
          )}
        </ImageContainer>
        {!loading && (
          <Label color="var(--c-neutral-1000)" bold>
            {isType(cardBoost.shopItem, 'LevelUpShopItem') && (
              <FormattedMessage
                id="CardPage.Boosts.level"
                defaultMessage="+1LVL"
              />
            )}
            <FontAwesomeIcon
              color="var(--c-green-600)"
              icon={faArrowUp}
              size="xs"
            />
          </Label>
        )}
      </Root>
      <ItemPreviewDialog
        open={showBuyDialog}
        item={item}
        onClose={onDialogClose}
        onBuy={onDialogClose}
      />
    </>
  );
};

Boost.fragments = {
  cardBoost: gql`
    fragment Boost_cardBoost on CardBoost {
      id
      xpToGain
      # shopItem does not expose an ID because it's a union type
      # eslint-disable-next-line sorare/enforce-apollo-typepolicies
      shopItem {
        ... on ShopItemInterface {
          id
          name
          pictureUrl
          myAvailableUserShopItems {
            id
          }
        }
        ...ItemPreviewDialog_shopItem
      }
    }
    ${ItemPreviewDialog.fragments.shopItem}
  ` as TypedDocumentNode<Boost_cardBoost>,
};

export default Boost;
