import classnames from 'classnames';
import { CSSProperties } from 'react';
import styled from 'styled-components';

import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import {
  flagUrl,
  toDisplayName,
  toThreeLettersCountryCode,
} from '@sorare/core/src/lib/territories';

type Props = {
  className?: string;
  country: {
    name?: string;
    slug: string;
  };
  type?: 'flat' | 'round';
  withCountryFlag?: boolean;
  withTooltip?: boolean;
  size?: number;
  imageRes?: 32 | 64;
  withCountryCode?: boolean;
};

const Root = styled.div`
  display: flex;
  align-items: center;
  & > * + * {
    margin-left: 8px;
  }
`;
const Container = styled.img`
  border-radius: 50%;
  &.flat {
    border-radius: 8px;
    border: none;
  }
  &.square {
    border-radius: 0;
  }
  &.s32 {
    width: var(--size, 16px);
    flex-shrink: 0;
    &.flat {
      border-radius: 2px;
    }
  }
  &.s64 {
    width: var(--size, 32px);
    flex-shrink: 0;
  }
`;
const Code = styled.p`
  text-transform: uppercase;
`;

export const FlagAvatar = ({
  country,
  type = 'round',
  imageRes = 32,
  withCountryCode = false,
  className,
  withCountryFlag = true,
  withTooltip,
  size,
}: Props) => {
  const displayName = toDisplayName(country.slug);
  const countryCode = toThreeLettersCountryCode(country.slug);

  const avatar = (
    <Root
      className={className}
      style={size ? ({ '--size': `${size}px` } as CSSProperties) : undefined}
    >
      {withCountryFlag && (
        <Container
          alt={country.name || countryCode}
          src={flagUrl({
            country,
            type: type === 'round' ? 'round' : 'flat',
            size: imageRes,
          })}
          className={classnames(type, `s${imageRes}`)}
        />
      )}
      {withCountryCode && <Code>{countryCode}</Code>}
    </Root>
  );

  return withTooltip ? <Tooltip title={displayName}>{avatar}</Tooltip> : avatar;
};

export default FlagAvatar;
