import classNames from 'classnames';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { LinkBox, LinkOverlay } from '@sorare/core/src/atoms/navigation/Box';
import { Text14, Text18 } from '@sorare/core/src/atoms/typography';
import { glossary } from '@sorare/core/src/lib/glossary';
import { theme } from '@sorare/core/src/style/theme';

const IconWrapper = styled.div`
  grid-area: icon;
  --fan-wrapper-width: 60px;
  --fan-element-width: var(--triple-unit);
`;

const StyledTitle = styled(Text18)`
  grid-area: title;
  align-self: end;
`;
const StyledDescription = styled(Text14)`
  grid-area: caption;
  align-self: start;
  color: var(--c-neutral-600);
  white-space: nowrap;
`;
const StyledButton = styled(Button)`
  grid-area: cta;
`;
const Wrapper = styled(LinkBox)`
  padding: var(--intermediate-unit);
  color: var(--c-neutral-1000);
  display: grid;
  grid-template-columns: calc(8 * var(--unit)) 1fr max-content;
  grid-template-areas:
    'icon title cta'
    'icon caption cta';
  align-items: center;
  border: 1px solid rgba(var(--c-rgb-brand-600), 0.6);
  border-radius: ${theme.radius.sm}px;
  background: linear-gradient(
    84.1deg,
    rgba(128, 148, 255, 0.2) 0%,
    rgba(217, 199, 255, 0.2) 28.32%,
    rgba(228, 184, 255, 0.2) 54.55%,
    rgba(45, 66, 178, 0.2) 100%
  );
  text-align: unset;
  &.disabled {
    border: unset;
    background: var(--c-neutral-200);
    & ${StyledTitle} {
      color: var(--c-neutral-600);
    }
  }
`;

type Props = {
  onClick?: () => void;
  disabled?: boolean;
  icon: ReactNode;
  title: ReactNode;
  description: ReactNode;
  hideClaimButton?: boolean;
};

export const DumbBanner = ({
  onClick,
  disabled,
  icon,
  title,
  description,
  hideClaimButton,
}: Props) => {
  return (
    <Wrapper className={classNames({ disabled })}>
      <IconWrapper>{icon}</IconWrapper>
      <StyledTitle bold>{title}</StyledTitle>
      <StyledDescription as="div">{description}</StyledDescription>
      {!hideClaimButton && (
        <LinkOverlay
          as={StyledButton}
          type="button"
          disableRipple
          small
          onClick={onClick}
          color={disabled ? 'white' : 'blue'}
          disabled={disabled}
        >
          <FormattedMessage {...glossary.claim} />
        </LinkOverlay>
      )}
    </Wrapper>
  );
};
