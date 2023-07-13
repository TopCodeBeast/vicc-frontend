import styled from 'styled-components';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';

import PlaceholderIcon from './PlaceholderIcon';

const Wrapper = styled.div`
  --c-gradient-card-placeholder-common: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(0, 0, 0, 0) 100%
    ),
    var(--c-neutral-300);
  --c-gradient-card-placeholder-limited: linear-gradient(
      180deg,
      rgba(211, 153, 57, 0.2) 0%,
      rgba(0, 0, 0, 0) 100%
    ),
    var(--c-neutral-300);
  --c-gradient-card-placeholder-rare: linear-gradient(
      180deg,
      rgba(168, 27, 29, 0.2) 0%,
      rgba(0, 0, 0, 0) 100%
    ),
    var(--c-neutral-300);
  --c-gradient-card-placeholder-superRare: linear-gradient(
      180deg,
      rgba(62, 103, 240, 0.2) 0%,
      rgba(0, 0, 0, 0) 100%
    ),
    var(--c-neutral-300);
  --c-gradient-card-placeholder-unique: linear-gradient(
      180deg,
      rgba(63, 62, 61, 0.2) 0%,
      rgba(0, 0, 0, 0) 100%
    ),
    var(--c-neutral-300);
  background: var(--c-gradient-card-placeholder-common);
  &.limited {
    background: var(--c-gradient-card-placeholder-limited);
  }
  &.rare {
    background: var(--c-gradient-card-placeholder-rare);
  }
  &.super_rare {
    background: var(--c-gradient-card-placeholder-superRare);
  }
  &.unique {
    background: var(--c-gradient-card-placeholder-unique);
  }
  color: var(--c-neutral-1000);
  aspect-ratio: var(--card-aspect-ratio);
  border-radius: var(--unit);
  display: flex;
  align-items: center;
  justify-content: center;
`;

type Props = {
  rarity: Rarity;
  empty: boolean;
  locked: boolean;
  available: boolean;
};

export const CardPlaceholder = ({
  rarity,
  empty,
  locked,
  available,
}: Props) => {
  return (
    <Wrapper className={rarity}>
      <PlaceholderIcon
        rarity={rarity}
        empty={empty}
        locked={locked}
        available={available}
      />
    </Wrapper>
  );
};
