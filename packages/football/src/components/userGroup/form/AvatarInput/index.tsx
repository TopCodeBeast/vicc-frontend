import { faCamera } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { ShopItemType } from '@sorare/core/src/__generated__/globalTypes';
import Clickable from '@sorare/core/src/atoms/buttons/Clickable';
import FormLabel from '@sorare/core/src/components/form/FormLabel';
import useToggle from '@sorare/core/src/hooks/useToggle';

import ShopItemDialog from '@football/components/shopItems/ShopItemDialog';

import { ShopItemLogo } from './types';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const Placeholder = styled.div`
  width: 96px;
  height: 96px;
  border-radius: var(--double-unit);
  background-color: var(--c-neutral-1000);
  color: var(--c-neutral-100);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const PlaceHolderIcon = styled(FontAwesomeIcon)`
  font-size: 24px;
`;

const Image = styled.img`
  width: 96px;
  height: 96px;
  border-radius: var(--double-unit);
  object-fit: cover;
`;

const Avatar = styled(Clickable)`
  margin: auto;
`;

type Props = {
  onSelectNewSkin: (skinId: string) => void;
  defaultValue?: string;
  id: string;
};
export const AvatarInput = ({ onSelectNewSkin, id, defaultValue }: Props) => {
  const [pickingSkin, togglePickingSking] = useToggle(false);
  const [skin, setSkin] = useState<ShopItemLogo>();
  const pickSkin = (pickedSkin: ShopItemLogo) => {
    setSkin(pickedSkin);
    onSelectNewSkin(pickedSkin.id);
    togglePickingSking();
  };
  const src = skin?.pictureUrl || defaultValue;
  return (
    <Root>
      <ShopItemDialog
        open={!!pickingSkin}
        type={ShopItemType.LOGO}
        onSelect={pickSkin}
        onClose={togglePickingSking}
      />
      <FormLabel id={id}>
        <FormattedMessage
          id="UserGroups.create.avatar"
          defaultMessage="League Logo"
        />
      </FormLabel>
      <Avatar onClick={togglePickingSking}>
        {src ? (
          <Image src={src} />
        ) : (
          <Placeholder>
            <PlaceHolderIcon icon={faCamera} />
          </Placeholder>
        )}
      </Avatar>
    </Root>
  );
};

export default AvatarInput;
