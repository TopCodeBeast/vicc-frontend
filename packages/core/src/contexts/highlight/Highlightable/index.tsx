import { ReactElement, ReactNode } from 'react';

import OnboardingTooltip from '@core/atoms/tooltip/OnboardingTooltip';
import HighlightableWrapper from '@core/components/HighlightableWrapper';

import { useHighLightContext } from '..';

type Props = {
  children: ReactElement;
  name?: string | null;
  message?: ReactNode;
  noBackdrop?: boolean;
  background?: boolean;
  inModal?: boolean;
  disabled?: boolean;
  position?: 'right' | 'left';
};

const Highlightable = (props: Props) => {
  const {
    children,
    name,
    message,
    noBackdrop,
    background,
    inModal,
    disabled,
    position = 'right',
  } = props;
  const { highlighted, unhighlight } = useHighLightContext();
  const highlightOpen = !!(
    name !== null &&
    highlighted === name &&
    !disabled &&
    message
  );

  return (
    <HighlightableWrapper
      highlightOpen={highlightOpen}
      background={background}
      noBackdrop={noBackdrop}
      onClick={unhighlight}
      inModal={inModal}
    >
      {highlightOpen && (
        <OnboardingTooltip message={message} position={position} />
      )}
      {children}
    </HighlightableWrapper>
  );
};

export default Highlightable;
