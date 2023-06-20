import { MessageDescriptor } from 'react-intl';

import { Rarity } from '@sorare/core/src/__generated__/globalTypes';
import { fromBirthDateToAge } from '@sorare/core/src/lib/birthDate';
import { FILTERS } from '@sorare/core/src/lib/filters';
import { scarcityMessages } from '@sorare/core/src/lib/scarcity';

import { RefinementItem } from 'search/ActiveFilters/types';
import { formatBundledOption } from '@sorare/marketplace/src/searchCards/RefineList';

export const formatListFilterWidgetValue = (
  item: RefinementItem,
  options: { formatMessage: (m: MessageDescriptor) => string }
): string[] => {
  return item.refinements.map(refinement => {
    let { label } = refinement;
    if (
      item.attribute === FILTERS.rarity.attribute &&
      Object.keys(Rarity).includes(refinement.value.toString())
    ) {
      const rarity = refinement.value as Rarity;
      label = options.formatMessage(
        scarcityMessages[rarity] as MessageDescriptor
      );
    } else if (item.attribute === FILTERS.bundledSale.attribute) {
      label = formatBundledOption(
        refinement.value.toString(),
        options.formatMessage
      );
    }

    return label;
  });
};

export const formatRangeFilterWidgetValue = (
  item: RefinementItem,
  options: {
    formatPrice: (value: number) => string;
  }
): string[] => {
  let sortedRefinements = item.refinements;
  if (item.attribute === FILTERS.age.attribute) {
    sortedRefinements = item.refinements.sort(
      (a, b) => Number(b.value) - Number(a.value)
    );
  }

  const refinements = sortedRefinements.map(refinement => {
    const numberValue = Number(refinement.value);

    let formattedValue;
    switch (item.attribute) {
      case FILTERS.age.attribute:
        formattedValue = fromBirthDateToAge(numberValue);
        break;
      case FILTERS.price.attribute:
        formattedValue = options.formatPrice(numberValue);
        break;
      case FILTERS.lastFiveAppearances.attribute:
        formattedValue = `${Math.round(numberValue * (100 / 5))}%`;
        break;
      case FILTERS.lastFifteenAppearances.attribute:
        formattedValue = `${Math.round(numberValue * (100 / 15))}%`;
        break;
      default:
        formattedValue = numberValue;
        break;
    }

    return {
      ...refinement,
      value: formattedValue,
    };
  });

  let text;
  if (refinements.length === 1) {
    const [{ value, operator: rawOperator }] = refinements;

    const operators: { [key: string]: string } = {
      '>=': '≥',
      '<=': '≤',
    };
    let operator = operators[rawOperator];
    if (item.attribute === FILTERS.age.attribute) {
      const reverseRawOperator = rawOperator === '>=' ? '<=' : '>=';
      operator = operators[reverseRawOperator];
    }
    text = `${operator} ${value}`;
  } else {
    text = `${refinements[0].value} - ${refinements[1].value}`;
  }

  return [text];
};
