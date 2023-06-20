import { faClose } from '@fortawesome/pro-solid-svg-icons';
import classnames from 'classnames';
import { FC } from 'react';
import styled from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { stroke } from '@sorare/core/src/style/utils';

import CaptainToggle from '@sorare/football/src/components/so5/ComposeTeam/responsive/CaptainToggle';

const CaptainWrapper = styled.div`
  position: absolute;
  z-index: 1;
  transform: translate(-50%, -50%);
`;
const RemoveWrapper = styled.div`
  position: absolute;
  z-index: 1;
  right: calc(var(--intermediate-unit) * -1);
  top: calc(var(--intermediate-unit) * -1);
  opacity: 1;
  @media (hover: hover) and (pointer: fine) {
    opacity: 0;
    &:hover {
      opacity: 1;
    }
  }
`;
const Card = styled.div`
  isolation: isolate;
  position: relative;
  height: auto;
  max-width: 145px;
  width: min(15vh, calc(25% - var(--half-unit)));
  cursor: pointer;
  margin: var(--quadruple-unit) min(4%, var(--quadruple-unit));
  img {
    max-width: 100%;
  }
  /* only target card image */
  &.selected img[src*='image'] {
    ${stroke('2px')}
  }
  &:hover,
  &:focus-within {
    ${RemoveWrapper} {
      opacity: 1;
    }
  }
  &.noPointerEvents {
    pointer-events: none;
  }

  @media (orientation: landscape) and (max-height: 650px),
    (orientation: portrait) and (max-height: 650px) {
    margin: var(--double-unit);
    width: 20vmin;
    min-width: 100px;
  }
`;

export type Props = FC<{
  selected?: boolean;
  showCaptainToggle?: boolean;
  isCaptain?: boolean;
  disableCaptainAnimation?: boolean;
  onCaptainToggle?: () => void;
  onRemove?: () => void;
  noPointerEvents?: boolean;
}>;
const CardWrapper: Props = ({
  selected,
  children,
  showCaptainToggle,
  isCaptain,
  disableCaptainAnimation,
  onCaptainToggle,
  onRemove,
  noPointerEvents,
}) => (
  <Card className={classnames({ selected, noPointerEvents })}>
    {showCaptainToggle && (
      <CaptainWrapper>
        <CaptainToggle
          disablePositioning
          onClick={onCaptainToggle}
          active={Boolean(isCaptain)}
          disableAnimation={disableCaptainAnimation}
        />
      </CaptainWrapper>
    )}
    {onRemove && (
      <RemoveWrapper>
        <IconButton color="white" small icon={faClose} onClick={onRemove} />
      </RemoveWrapper>
    )}
    {children}
  </Card>
);

export default CardWrapper;
