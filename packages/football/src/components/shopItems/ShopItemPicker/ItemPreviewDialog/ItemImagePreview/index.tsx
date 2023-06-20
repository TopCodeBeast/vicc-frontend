import classnames from 'classnames';
import { useState } from 'react';
import styled from 'styled-components';

import { ShopItemType } from '@sorare/core/src/__generated__/globalTypes';
import Dots from '@sorare/core/src/atoms/layout/Dots';
import {
  LinkBox,
  LinkOther,
  LinkOverlay,
} from '@sorare/core/src/atoms/navigation/Box';

import ItemImagePlaceholder from './ItemImagePlaceholder';

const Root = styled(LinkBox)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: var(--double-unit);
  user-select: none;
`;
const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 150px;
`;
const ItemImage = styled.img`
  align-self: center;
  max-width: 100%;
  width: 150px;
  &.banner {
    width: 100%;
  }
`;

const PREVIEW_TYPES = [ShopItemType.BANNER, ShopItemType.SHIELD];

type Props = { pictureUrl: string; name: string; type: ShopItemType };
const ItemImagePreview = ({ pictureUrl, name, type }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const itemImage = (
    <ItemImage
      key="image"
      className={classnames({
        banner: type === ShopItemType.BANNER,
      })}
      src={pictureUrl}
      alt={name}
    />
  );

  if (!PREVIEW_TYPES.includes(type)) {
    return itemImage;
  }

  const steps = [
    itemImage,
    <ItemImagePlaceholder
      key="placeholder"
      type={type}
      name={name}
      pictureUrl={pictureUrl}
    />,
  ];

  return (
    <Root>
      <LinkOverlay
        onClick={() => setActiveIndex((activeIndex + 1) % steps.length)}
      >
        <Content>{steps[activeIndex]}</Content>
      </LinkOverlay>
      <LinkOther>
        <Dots
          count={steps.length}
          current={activeIndex}
          onChange={setActiveIndex}
        />
      </LinkOther>
    </Root>
  );
};

export default ItemImagePreview;
