import { faUserPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { animated, config, useSpring } from '@react-spring/web';
import styled from 'styled-components';

import Tooltip from '@sorare/core/src/atoms/tooltip/Tooltip';
import { Text16, button14 } from '@sorare/core/src/atoms/typography';
import ResponsiveImg, {
  ValidWidths,
} from '@sorare/core/src/atoms/ui/ResponsiveImg';
import { theme } from '@sorare/core/src/style/theme';

import { positionShortNames } from '@football/lib/so5';

const TooltipStyled = styled(Tooltip)`
  width: 100%;
  height: 100%;
`;

const StyledAnimatedResponsiveImg = styled(animated(ResponsiveImg))`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const Img: FC<{
  src: string;
  alt: string;
  width: ValidWidths;
  height: number;
}> = ({ width, ...rest }) => {
  const animation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.gentle,
    delay: 150,
  });
  return (
    <StyledAnimatedResponsiveImg
      style={animation}
      {...rest}
      cropWidth={width}
    />
  );
};
const Remove = styled.button`
  position: absolute;
  right: calc(var(--half-unit) * -1);
  top: calc(var(--half-unit) * -1);
  align-items: center;
  justify-content: center;
  margin: 0;
  background: var(--c-neutral-100);
  color: var(--c-neutral-600);
  border-radius: ${theme.radius.circle};
  width: var(--double-and-a-half-unit);
  height: 20px;
  cursor: pointer;
`;
const CardContainer = styled.div`
  position: relative;
  ${Remove} {
    display: inline-flex;
  }
  @media (min-width: ${theme.breakpoints.values.desktop}px) {
    ${Remove} {
      display: none;
    }
    &:hover,
    &:focus {
      ${Remove} {
        display: inline-flex;
      }
    }
  }
`;

const Card = styled.button`
  width: 60px;
  height: 60px;
  overflow: hidden;
  isolation: isolate;
  aspect-ratio: 1;
  border: 1px solid var(--c-neutral-500);
  border-radius: 16px;
  color: var(--c-neutral-500);
  cursor: pointer;
  position: relative;
  &.withPicture {
    border: 2px solid var(--c-neutral-100);
  }
  &.active,
  &.error {
    color: var(--c-neutral-1000);
    border: 2px solid var(--c-brand-600);
    background-color: rgba(var(--c-rgb-brand-600), 0.4);
    &.withPicture::before {
      position: absolute;
      inset: -2px;
      content: '';
      background-color: rgba(var(--c-rgb-brand-600), 0.4);
      z-index: 1;
      border-radius: inherit;
    }
  }
  &:hover,
  &:focus {
    border-color: var(--c-brand-600);
  }

  &.error {
    color: var(--c-static-red-300);
    border: 2px solid var(--c-static-red-300);
    background-color: rgba(var(--c-rgb-red-300), 0.4);
    &.withPicture::before {
      background-color: rgba(var(--c-rgb-red-300), 0.4);
    }
  }
`;

const Value = styled.p`
  ${button14};
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 50%);
  padding: 0 var(--unit);
  border-radius: ${theme.radius.chip};
  background: var(--c-neutral-200);
  color: var(--c-neutral-1000);
  border: solid 2px var(--c-neutral-200);
  &.error {
    background: var(--c-static-red-300);
  }
`;
type PickerCardProps = {
  position: keyof typeof positionShortNames;
  active?: boolean;
  error?: boolean;
  onClick?: () => void;
  drafted?: {
    value: number;
    avatarUrl?: string;
    player: { displayName: string };
  };
  remove?: () => void;
};

export const PickerCard = ({
  active,
  error,
  onClick,
  drafted,
  position,
  remove,
}: PickerCardProps) => {
  return (
    <CardContainer>
      <Card
        className={classnames({
          active,
          error,
          withPicture: drafted,
        })}
        onClick={onClick}
        type="button"
      >
        {drafted ? (
          <TooltipStyled title={drafted.player.displayName}>
            <Img
              src={drafted.avatarUrl || ''}
              alt={drafted.player.displayName}
              width={80}
              height={80}
            />
          </TooltipStyled>
        ) : (
          <>
            <FontAwesomeIcon icon={faUserPlus} size="lg" />
            <Text16>
              <strong>
                <FormattedMessage {...positionShortNames[position]} />
              </strong>
            </Text16>
          </>
        )}
      </Card>
      {!!drafted && (
        <>
          {!!remove && (
            <Remove onClick={remove}>
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path
                  d="M3.87879 5.69787L0.439453 2.25853L2.56077 0.137207L6.00011 3.57655L9.43945 0.137207L11.5608 2.25853L8.12143 5.69787L11.5608 9.13721L9.43945 11.2585L6.00011 7.81919L2.56077 11.2585L0.439453 9.13721L3.87879 5.69787Z"
                  fill="currentcolor"
                />
              </svg>
            </Remove>
          )}
          <Value className={classnames({ error })}>{drafted?.value}</Value>
        </>
      )}
    </CardContainer>
  );
};
