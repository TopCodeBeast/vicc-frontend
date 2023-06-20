import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import styled, { keyframes } from 'styled-components';

import { Text14 } from '@sorare/core/src/atoms/typography';
import { Color } from '@sorare/core/src/style/types';

const Root = styled.button`
  position: relative;
  isolation: isolate;
  text-align: center;
  display: grid;
  color: var(--c-neutral-1000);
  &:hover,
  &:focus {
    color: var(--c-neutral-1000);
  }
`;
const RoundedButtonIcon = styled.div<{ color: Color }>`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-static-neutral-100);
  border-radius: 50%;
  overflow: hidden;
  background: ${({ color }) => color};
  font-size: 24px;
  cursor: pointer;
  ${Root} &:hover {
    filter: brightness(1.1);
    color: var(--c-static-neutral-100);
  }
`;
const appearIn = keyframes`
  30%, 99% {
    opacity: 1;
    transform: translateY(-100%);
  }
  100% {
    opacity: 0;
  }
`;
const PopMessage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  text-align: center;
  opacity: 0;
  transform: translateY(-50%);
  animation: ${appearIn} 1s ease infinite;
  color: var(--c-neutral-1000);
`;

type Props = {
  onClick: () => void;
  label: string | MessageDescriptor;
  color: Color;
  icon: IconProp;
  href?: string;
  download?: boolean;
  disabled?: boolean;
  popMessage?: ReactNode;
};
const RoundedButton = ({
  onClick,
  label,
  color = 'var(--c-static-neutral-700)',
  icon,
  href,
  download,
  disabled,
  popMessage,
}: Props) => {
  const tagProps = href
    ? { href, target: '_blank', rel: 'noopener noreferrer', download }
    : { disabled };
  return (
    <Root onClick={onClick} as={href ? 'a' : 'button'} {...tagProps}>
      {popMessage && <PopMessage>{popMessage}</PopMessage>}
      <RoundedButtonIcon color={color}>
        <FontAwesomeIcon icon={icon} />
      </RoundedButtonIcon>
      <Text14>
        {typeof label === 'string' ? label : <FormattedMessage {...label} />}
      </Text14>
    </Root>
  );
};

export default RoundedButton;
