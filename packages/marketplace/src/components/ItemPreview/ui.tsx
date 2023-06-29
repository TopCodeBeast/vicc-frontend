import styled from 'styled-components';

import { Text14 } from '@sorare/core/src/atoms/typography';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

export const Container = styled.div`
  display: flex;
  align-items: flex-start;
  padding-right: 0;
  padding-left: 0;
  gap: var(--unit);
  &:not(:last-child) + &:not(.noBorder) {
    border-bottom: 1px solid var(--c-neutral-300);
  }
  &:not(.noBorder) + &:not(.noBorder) {
    padding-top: var(--double-unit);
    border-bottom: none;
  }
`;

export const ItemDesktopPreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  & > * {
    flex: 1;
  }
`;

export const CardContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: var(--card-mobile-width);
`;

export const CardCount = styled.div`
  position: absolute;
  left: 5px;
  bottom: 5px;
  height: 24px;
  width: 26px;
  background-color: var(--c-neutral-100);
  display: flex;
  justify-content: center;
  border-radius: var(--unit);
`;
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  align-items: flex-start;
`;
export const Properties = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: var(--unit);
  color: var(--c-neutral-600);
  justify-content: space-between;
  flex-direction: row-reverse;
`;

export const Info = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
export const PriceInfoButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--unit);
  flex-direction: column;
`;
export const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;
export const Price = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;
export const SaleInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  min-width: 0;
  height: var(--triple-unit);

  .dark-theme & {
    color: var(--c-neutral-600);
  }
`;
export const SaleInfo = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Bid = styled.div`
  display: flex;
`;

export const ItemForSaleContainer = styled(Text14).attrs({ as: 'div' })`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-weight: var(--bold);
`;
export const ItemForSaleSecondRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--unit);
  gap: var(--unit);
  height: var(--triple-unit);
`;

export const ItemImgContainer = styled.div`
  --image-width: var(--card-mobile-width);
  flex-basis: var(--image-width);
  min-width: var(--image-width);
  aspect-ratio: var(--card-aspect-ratio);
  &.isDesktopLayout {
    --image-width: auto;
  }
`;

export const ItemInfosContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
  overflow: hidden;
  flex: 1;
  &.isDesktopLayout {
    gap: var(--unit);
  }
`;

export const ItemPropertiesContainer = styled.div`
  height: 32px;
  display: flex;
  gap: var(--unit);
  align-items: center;
  color: var(--c-neutral-600);
`;

export const TokenDetailsRoot = styled(Text14).attrs({ as: 'div' })`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--unit);
  font-weight: var(--bold);
  &.allowColumnLayout {
    @media ${tabletAndAbove} {
      flex-direction: row;
    }
  }
`;

export const TokenDetailsInfos = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

export const TokenDetailsRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--unit);
  height: var(--triple-unit);
`;

export const ButtonContainer = styled.div`
  display: flex;
  @media ${tabletAndAbove} {
    display: block;
  }
`;
