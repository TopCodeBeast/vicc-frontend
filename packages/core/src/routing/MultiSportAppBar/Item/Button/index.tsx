import { ButtonProps, Button as MuiButton } from '@material-ui/core';
import classnames from 'classnames';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

export interface Props extends Omit<ButtonProps, 'classes'> {
  to?: string;
  externalLink?: boolean;
  exactMatch?: boolean;
  subMenuMatches?: { to?: string; exactMatch?: boolean }[];
  active?: boolean;
}

const Root = styled(MuiButton)`
  font-family: apercu-pro, system-ui, sans-serif;
  font-weight: var(--t-bold);
  font-style: normal;
  font-size: 16px;
  min-width: 0;
  height: 40px;
  padding: 0;
  text-transform: none;
  color: white;
  opacity: 0.5;
  &:hover {
    color: white;
    opacity: 1;
  }
  &.active {
    color: white;
    opacity: 1;
    border-radius: 0;
  }
`;

export const Button = (props: Props) => {
  const location = useLocation();
  const {
    children,
    onClick,
    to,
    externalLink,
    exactMatch,
    subMenuMatches,
    active: activeProp,
    ...rest
  } = props;

  const active = useMemo(() => {
    if (activeProp) return true;

    const mainItemMatch =
      to &&
      location.pathname.match(to) &&
      (exactMatch ? to === location.pathname : true);

    const subItemMatch = subMenuMatches?.some(subMenuRoute => {
      return (
        subMenuRoute.to &&
        location.pathname.match(subMenuRoute.to) &&
        (subMenuRoute.exactMatch ? subMenuRoute.to === location.pathname : true)
      );
    });
    return mainItemMatch || subItemMatch;
  }, [activeProp, to, location.pathname, exactMatch, subMenuMatches]);

  return (
    <Root
      variant="text"
      onClick={onClick}
      {...(externalLink
        ? ({ target: '_blank', rel: 'noopener noreferrer' } as any)
        : {})}
      to={to}
      {...rest}
      className={classnames({
        active,
      })}
    >
      {children}
    </Root>
  );
};

export default Button;
