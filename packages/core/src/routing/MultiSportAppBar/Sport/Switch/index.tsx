import classnames from 'classnames';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Sport } from '__generated__/globalTypes';
import { FOOTBALL_HOME, MLB_HOME, NBA_HOME } from '@core/constants/routes';
import useFeatureFlags from '@core/hooks/useFeatureFlags';

import { useAppBarContext } from '../../context';
import { Baseball } from '../Baseball';
import { Football } from '../Football';
import { NBA, NBAChristmas } from '../NBA';

interface Props {
  Component: () => JSX.Element;
  to: string;
  sport: Sport;
}

const SportLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
  color: var(--c-neutral-100);
  opacity: 0.5;
  &:focus,
  &:hover,
  &.active {
    opacity: 1;
    color: var(--c-neutral-100);
  }
`;

export const Switch = ({ to, Component, sport }: Props) => {
  const { sport: sportContext } = useAppBarContext();

  const active = sport === sportContext || sportContext === undefined;

  return (
    <SportLink to={to} className={classnames({ active })}>
      <Component />
    </SportLink>
  );
};

const FootballSwitch = () => {
  return (
    <Switch Component={Football} to={FOOTBALL_HOME} sport={Sport.FOOTBALL} />
  );
};

const NBASwitch = () => {
  const {
    flags: { useNbaChristmasLogo = false },
  } = useFeatureFlags();
  return (
    <Switch
      Component={useNbaChristmasLogo ? NBAChristmas : NBA}
      to={NBA_HOME}
      sport={Sport.NBA}
    />
  );
};

const MLBSwitch = () => {
  return <Switch Component={Baseball} to={MLB_HOME} sport={Sport.BASEBALL} />;
};

export const sportLogos: {
  [key in Sport]: ({ active }: { active: boolean }) => JSX.Element;
} = {
  [Sport.FOOTBALL]: Football,
  [Sport.NBA]: NBA,
  [Sport.BASEBALL]: Baseball,
};

export const switches: { [key in Sport]: ReactNode } = {
  [Sport.FOOTBALL]: <FootballSwitch />,
  [Sport.NBA]: <NBASwitch />,
  [Sport.BASEBALL]: <MLBSwitch />,
};

export default Switch;
