import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Root = styled.nav`
  display: flex;
  white-space: nowrap;
  overflow: auto;
  scroll-snap-type: x mandatory;
  border-bottom: 1px solid var(--c-neutral-200);
`;

const Tab = styled(NavLink)`
  scroll-snap-align: start;
  padding: var(--unit) var(--double-unit);
  border-bottom: 2px solid transparent;
  color: var(--c-static-neutral-500);
  display: block;
  &.active {
    border-color: var(--c-brand-600);
    font-weight: var(--t-bold);
    color: var(--c-neutral-1000);
  }
  &:hover,
  &:active,
  &:focus {
    color: var(--c-neutral-1000);
  }
`;

type Props = {
  items: { to: string; label: ReactNode; end?: false; replace?: boolean }[];
};
const NavigationTabs = ({ items }: Props) => {
  return (
    <Root>
      {items.map(({ to, label, end = true, replace }) => (
        <Tab key={to} to={to} end={end} replace={replace}>
          {label}
        </Tab>
      ))}
    </Root>
  );
};

export default NavigationTabs;
