import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import { useSportContext } from '@sorare/core/src/contexts/sport';
import { FILTERS } from '@sorare/core/src/lib/filters';

import { useMarketplaceContext } from '@sorare/marketplace/src/contexts/Marketplace';
import { useFormatFilterWidgetValue } from '@sorare/marketplace/src/hooks/search/useFormatFilterWidgetValue';

import { FilterChip } from '../FilterChip';
import { RefinementItem } from '../types';

const ChipTitle = styled.span.attrs(props => ({ lang: props.lang }))`
  &:after {
    content: ': ';
  }
  &:lang(fr-FR):after {
    content: ' : ';
  }
`;

export const RangeActiveFilter = ({ item }: { item: RefinementItem }) => {
  const { formatMessage, locale } = useIntl();
  const { trackRemoveMarketFilterChip } = useMarketplaceContext();
  const { sport } = useSportContext();
  const { formatFilterWidgetValue } = useFormatFilterWidgetValue();

  const title = useMemo(
    () =>
      Object.values(FILTERS).find(
        ({ attribute }) => attribute === item.attribute
      )?.title,
    [item.attribute]
  );

  const [label] = formatFilterWidgetValue(item);

  const onClick = useCallback(() => {
    item.refinements.forEach(refinement => {
      item.refine(refinement);
    });
    if (sport) {
      trackRemoveMarketFilterChip(item.attribute, label, sport);
    }
  }, [item, label, trackRemoveMarketFilterChip, sport]);

  if (!title) {
    return null;
  }

  return (
    <FilterChip
      label={
        <>
          <ChipTitle lang={locale}>{formatMessage(title)}</ChipTitle>
          <span>{label}</span>
        </>
      }
      onClose={onClick}
    />
  );
};
