import { faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo } from 'react';
import { useCurrentRefinements } from 'react-instantsearch-hooks-web';
import { FormattedMessage } from 'react-intl';
import styled, { css } from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import { FILTERS, FilterWidget } from '@sorare/core/src/lib/filters';

import { useFormatFilterWidgetValue } from '@marketplace/hooks/search/useFormatFilterWidgetValue';
import { RefinementItem } from '@marketplace/search/ActiveFilters/types';

type Props = {
  widget: FilterWidget;
  activeWidget?: FilterWidget;
  value?: string;
  onClick: () => void;
};

const Showable = styled.div<{ show: boolean }>`
  ${({ show }) =>
    !show &&
    css`
      display: none !important;
    `}
`;
const Root = styled(Showable)`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  padding: var(--double-unit);
  border-bottom: 1px solid var(--c-neutral-300);

  &:not(:has(.FilterWidget.visible)) {
    display: none;
  }
`;
const Title = styled(Showable)`
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  overflow: hidden;
`;
const Value = styled(Text16)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MobileFilterWidget = ({
  widget,
  activeWidget,
  value,
  onClick,
}: Props) => {
  const { formatFilterWidgetValue } = useFormatFilterWidgetValue();

  const defaultOpen = widget.accordionOptions?.startsOpen;
  const showTitle = !activeWidget;
  const showComponent =
    (defaultOpen && showTitle) ||
    (!!activeWidget && activeWidget.key === widget.key);

  const shouldNavigate = widget.title && showTitle && !showComponent;
  const { items } = useCurrentRefinements();

  const stringifiedValue = useMemo(() => {
    let labels: string[] = [];
    if (widget.type === 'virtualToggle') {
      labels = formatFilterWidgetValue(widget.filter);
    } else if (widget.type === 'sort') {
      return value;
    } else {
      const refinement = ((items as any) as RefinementItem[]).find(
        (item: RefinementItem) => item.attribute === widget.attribute
      );

      if (refinement) {
        labels = formatFilterWidgetValue(refinement);
      }

      if (widget.attribute === FILTERS.averageScore.attribute) {
        labels = [FILTERS.lastFiveAverageScore, FILTERS.lastFifteenAverageScore]
          .map(filter => {
            const scoreRefinement = ((items as any) as RefinementItem[]).find(
              (item: RefinementItem) => filter.attribute === item.attribute
            );

            if (!scoreRefinement) {
              return undefined;
            }

            return `${filter.alias} ${formatFilterWidgetValue(
              scoreRefinement
            )}`;
          })
          .filter(Boolean)
          .flat();
      }
    }
    return labels.join(', ');
  }, [widget, formatFilterWidgetValue, items, value]);

  return (
    <Root show={showTitle || showComponent}>
      <Title
        as={shouldNavigate ? 'button' : 'div'}
        type="button"
        onClick={shouldNavigate ? onClick : undefined}
        show={showTitle}
      >
        {widget.title ? (
          <>
            <Content>
              {widget.title || widget.component}
              {shouldNavigate && (
                <Value
                  color={
                    stringifiedValue
                      ? 'var(--c-brand-300)'
                      : 'var(--c-neutral-600)'
                  }
                >
                  {stringifiedValue || (
                    <FormattedMessage
                      id="FiltersManagerDialog.MobileFilterWidget.all"
                      defaultMessage="All"
                    />
                  )}
                </Value>
              )}
            </Content>
            {shouldNavigate && (
              <FontAwesomeIcon
                icon={faChevronRight}
                color="var(--c-neutral-600)"
              />
            )}
          </>
        ) : (
          widget.component
        )}
      </Title>
      {widget.title && (
        <Showable show={showComponent}>{widget.component}</Showable>
      )}
    </Root>
  );
};
