import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
} from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { ShopItemType } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import { Title2 } from '@sorare/core/src/atoms/typography';
import Dialog from '@sorare/core/src/components/dialog';
import { FOOTBALL_CLUB_SHOP } from '@sorare/core/src/constants/routes';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';

import ShopItemPicker from '@football/components/shopItems/ShopItemPicker';
import { ShopItemLogo } from '@football/components/userGroup/form/AvatarInput/types';

const DialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--triple-unit);
  gap: var(--double-unit);
`;
const BackButton = styled(Button)`
  align-self: flex-start;
`;
const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const messages: { [key in ShopItemType]: MessageDescriptor } = defineMessages({
  [ShopItemType.BANNER]: {
    id: 'ShopItemDialog.Title.Banner',
    defaultMessage: 'My Banners',
  },
  [ShopItemType.SHIELD]: {
    id: 'ShopItemDialog.Title.Shield',
    defaultMessage: 'My Badges',
  },
  [ShopItemType.EXTRA_SWAP]: {
    id: 'ShopItemDialog.Title.ExtraSwap',
    defaultMessage: 'My Extra Swap',
  },
  [ShopItemType.EXTRA_TEAMS_CAP]: {
    id: 'ShopItemDialog.Title.ExtraTeamsCap',
    defaultMessage: 'My Extra Teams',
  },
  [ShopItemType.LOGO]: {
    id: 'ShopItemDialog.Title.Logo',
    defaultMessage: 'My Logos',
  },
  [ShopItemType.XP_RESTORE]: {
    id: 'ShopItemDialog.Title.XpRestore',
    defaultMessage: 'My XP restores',
  },
  [ShopItemType.LEVEL_UP]: {
    id: 'ShopItemDialog.Title.LevelUp',
    defaultMessage: 'My level ups',
  },
  [ShopItemType.JERSEY]: {
    id: 'ShopItemDialog.Title.Jersey',
    defaultMessage: 'My Jerseys',
  },
});

type Props = {
  open: boolean;
  type?: ShopItemType;
  onSelect?: (shopItem: ShopItemLogo) => void;
  onClose: () => void;
};
const ShopItemDialog = ({ open, type, onSelect, onClose }: Props) => {
  const {
    flags: { disableClubShopPage = false },
  } = useFeatureFlags();

  if (!type) {
    return null;
  }

  return (
    <Dialog open={open} maxWidth="md" fullWidth onClose={onClose} darkTheme>
      <DialogContainer>
        <BackButton color="darkGray" medium onClick={onClose}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </BackButton>
        <FlexContainer>
          <Title2>
            <FormattedMessage {...messages[type]} />
          </Title2>
          {!disableClubShopPage && (
            <FlexContainer>
              <Button
                medium
                color="darkGray"
                to={FOOTBALL_CLUB_SHOP}
                component={Link}
              >
                <FormattedMessage
                  id="ShopItemDialog.GetMore"
                  defaultMessage="Go to shop"
                />
              </Button>
            </FlexContainer>
          )}
        </FlexContainer>
        <ShopItemPicker
          onSelect={onSelect}
          types={[type]}
          inventory={type !== ShopItemType.LOGO}
          inDialog
          hideSort
        />
      </DialogContainer>
    </Dialog>
  );
};

export default ShopItemDialog;
