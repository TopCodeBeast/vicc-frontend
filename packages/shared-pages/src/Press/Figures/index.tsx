import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import {
  DrukWide24,
  DrukWide64,
  Romie20,
} from '@sorare/core/src/components/marketing/typography';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  @media ${tabletAndAbove} {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 0px;
  }
`;

const Cell = styled.div<{ noBorder?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--double-and-a-half-unit) 0;
  border-bottom: solid 1px rgba(var(--c-rgb-neutral-100), 0.4);
  gap: calc(2 * var(--double-and-a-half-unit));
  @media ${tabletAndAbove} {
    padding: var(--double-and-a-half-unit) var(--double-and-a-half-unit) 0;
    aspect-ratio: 1;
    border-bottom: none;
    ${({ noBorder }) =>
      !noBorder
        ? 'border-left: solid 1px rgba(var(--c-rgb-neutral-100), 0.4);'
        : 'padding-left:0'}
  }
`;
const Title = styled(DrukWide24)`
  padding-top: calc(4 * var(--double-and-a-half-unit));
`;

const Figure = styled(DrukWide64)`
  @media ${tabletAndAbove} {
    word-break: break-word;
    padding-top: calc(4 * var(--double-and-a-half-unit));
  }
`;

const Category = styled(Romie20)`
  @media ${tabletAndAbove} {
    padding-bottom: var(--double-and-a-half-unit);
    border-bottom: solid 1px rgba(var(--c-rgb-neutral-100), 0.4);
  }
`;

export const Figures = () => {
  return (
    <Grid>
      <Cell noBorder>
        <Title color="var(--c-pink-600)">
          <FormattedMessage
            id="figures.title"
            defaultMessage="Vicc by the numbers"
          />
        </Title>
      </Cell>
      <Cell>
        <Figure color="var(--c-neutral-100)">3M</Figure>
        <Category color="var(--c-neutral-400)">
          <FormattedMessage id="figures.users" defaultMessage="Users" />
        </Category>
      </Cell>
      <Cell>
        <Figure color="var(--c-neutral-100)">350 +</Figure>
        <Category color="var(--c-neutral-400)">
          <FormattedMessage id="figures.partners" defaultMessage="Partners" />
        </Category>
      </Cell>
      <Cell noBorder>
        <Figure color="var(--c-neutral-100)">$769m</Figure>
        <Category color="var(--c-neutral-400)">
          <FormattedMessage
            id="figures.fundraising"
            defaultMessage="Fundraising"
          />
        </Category>
      </Cell>
      <Cell>
        <Figure color="var(--c-neutral-100)">180 +</Figure>
        <Category color="var(--c-neutral-400)">
          <FormattedMessage id="figures.markets" defaultMessage="Markets" />
        </Category>
      </Cell>
      <Cell>
        <Figure color="var(--c-neutral-100)">160</Figure>
        <Category color="var(--c-neutral-400)">
          <FormattedMessage id="figures.employees" defaultMessage="Employees" />
        </Category>
      </Cell>
    </Grid>
  );
};
