import styled from 'styled-components';

import { ShopItemType } from '@sorare/core/src/__generated__/globalTypes';

enum Areas {
  picture = 'picture',
  pictureUrl = 'picture_url',
  firstLine = 'first_line',
  secondLine = 'second_line',
  content = 'content',
}
const Root = styled.div`
  --areas: '${Areas.picture} ${Areas.firstLine} ${Areas.firstLine} .'
    '${Areas.picture} ${Areas.pictureUrl} ${Areas.secondLine} .'
    '${Areas.content} ${Areas.content} ${Areas.content} ${Areas.content}';
  display: grid;
  grid-template-areas: var(--areas);
  grid-template-rows: repeat(2, var(--double-unit)) 1fr;
  grid-template-columns: calc(6 * var(--unit)) var(--double-unit) 1fr 1fr;
  gap: var(--double-unit);
  padding: var(--double-unit);
  background-color: var(--c-neutral-300);
  border-radius: var(--intermediate-unit);
  width: 260px;
  height: 140px;
`;
const ItemImage = styled.img`
  grid-area: ${Areas.pictureUrl};
  width: var(--double-unit);
  height: var(--double-unit);
`;
const PlaceholderBlock = styled.div`
  background-color: var(--c-neutral-200);
  border-radius: var(--unit);
  width: 100%;
  height: 100%;
`;

type Props = { type: ShopItemType; name: string; pictureUrl: string };
const ItemImagePlaceholder = ({ type, name, pictureUrl }: Props) => {
  if (type === ShopItemType.SHIELD) {
    return (
      <Root>
        <PlaceholderBlock style={{ gridArea: Areas.picture }} />
        <ItemImage src={pictureUrl} alt={name} />
        <PlaceholderBlock style={{ gridArea: Areas.firstLine }} />
        <PlaceholderBlock style={{ gridArea: Areas.secondLine }} />
        <PlaceholderBlock style={{ gridArea: Areas.content }} />
      </Root>
    );
  }
  if (type === ShopItemType.BANNER) {
    return (
      <Root
        style={{
          background: `linear-gradient(0deg,
            rgba(var(--c-rgb-neutral-300), 100%) 0%,
            rgba(var(--c-rgb-neutral-300), 100%) 40%,
            rgba(var(--c-rgb-neutral-300), 0%) 100%
          ), top center / auto 60% no-repeat url(${pictureUrl})`,
        }}
      >
        <PlaceholderBlock style={{ gridArea: Areas.picture }} />
        <PlaceholderBlock style={{ gridArea: Areas.pictureUrl }} />
        <PlaceholderBlock style={{ gridArea: Areas.firstLine }} />
        <PlaceholderBlock style={{ gridArea: Areas.secondLine }} />
        <PlaceholderBlock style={{ gridArea: Areas.content }} />
      </Root>
    );
  }

  return null;
};

export default ItemImagePlaceholder;
