import classnames from 'classnames';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';

import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { LineupPosition } from '@sorare/core/src/lib/players';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import CardPlaceholderInfo from '@football/components/card/CardPlaceholderInfo';

import { ConfirmButton } from './ConfirmButton';

const FieldWrapper = styled.div`
  position: sticky;
  bottom: 0;
  background: var(--c-static-neutral-900);
  @media ${laptopAndAbove} {
    position: initial;
    bottom: unset;
    background: unset;
  }
`;

const BenchContentWrapper = styled.div`
  max-width: 560px; /* avoid enormous visually-unpleasant gap between cards */
  margin: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--intermediate-unit) var(--double-unit);
  @media ${laptopAndAbove} {
    padding: 0;
  }
`;

const CapBarWrapper = styled.div`
  flex: 1;
  padding-bottom: var(--double-unit);
  @media ${laptopAndAbove} {
    padding-bottom: 0;
  }
`;

const BenchField = styled.div`
  display: flex;
  gap: var(--unit);
  flex: 1;
  z-index: 1;
  justify-content: space-between;
  padding-bottom: var(--unit);
`;

const CardPlaceholder = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--c-static-rgb-neutral-100), 0.05);
  border: 2px solid rgba(var(--c-static-rgb-neutral-100), 0.1);
  border-radius: var(--unit);
  width: 100%;
  aspect-ratio: 1;
  color: var(--c-static-neutral-100);
  cursor: pointer;
  &:hover,
  &:focus {
    background: rgba(var(--c-static-rgb-neutral-100), 0.1);
    border: 2px solid rgba(var(--c-static-rgb-neutral-100), 0.15);
  }
  &.selected {
    background: rgba(var(--c-rgb-brand-600), 0.5);
    border: none;
  }
`;
const Card = styled.div`
  width: 60px;
  aspect-ratio: 1;
  border-radius: var(--unit);
  position: relative;
  img {
    max-width: 100%;
    border-radius: inherit;
    height: 100%;
    object-fit: cover;
  }
  &.selected {
    outline: 2px solid var(--c-brand-600);
  }
`;
const CardWrapper: FC<React.PropsWithChildren<{ selected: boolean }>> = ({
  selected,
  children,
}) => {
  return <Card className={classnames({ selected })}>{children}</Card>;
};

export type Props = {
  render: (props: {
    Card: FC<React.PropsWithChildren<{ selected: boolean }>>;
    CardPlaceholder: FC<
      React.PropsWithChildren<{
        onClick: () => void;
        selected: boolean;
        position: LineupPosition;
      }>
    >;
  }) => ReactNode;
  capBar?: ReactNode;
  confirm: (props: { ConfirmButton: typeof ConfirmButton }) => ReactNode;
  lineupComplete: boolean;
};

const Field = ({ render, capBar, confirm, lineupComplete }: Props) => {
  const { up: isLaptop } = useScreenSize('laptop');

  if (!capBar && isLaptop) {
    return null;
  }

  const capBarView = !!capBar && <CapBarWrapper>{capBar}</CapBarWrapper>;

  return (
    <FieldWrapper>
      <BenchContentWrapper className={classnames({ lineupComplete })}>
        {isLaptop ? (
          capBarView
        ) : (
          <>
            {capBarView}
            <BenchField>
              {render({
                Card: CardWrapper,
                CardPlaceholder: ({ onClick, selected, position }) => (
                  <CardPlaceholder
                    onClick={onClick}
                    className={selected ? 'selected' : ''}
                  >
                    <CardPlaceholderInfo position={position} />
                  </CardPlaceholder>
                ),
              })}
            </BenchField>
            {confirm({ ConfirmButton })}
          </>
        )}
      </BenchContentWrapper>
    </FieldWrapper>
  );
};

export default Field;
