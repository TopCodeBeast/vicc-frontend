import { faQuestion } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import ButtonBase from '@sorare/core/src/atoms/buttons/ButtonBase';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import BeginnersGuideDialog from './BeginnersGuideDialog';

const Root = styled(ButtonBase)`
  display: flex;
  align-items: center;
  justify-content: center;

  /* Pseudo-element to make the clickable area larger without having the button take mare space in the layout */
  &::after {
    position: absolute;
    content: '';
    width: 44px;
    height: 44px;
  }
`;

const IconWrapper = styled.span`
  color: var(--c-neutral-100);
  width: var(--intermediate-unit);
  height: var(--intermediate-unit);
  font-size: var(--unit);
  border-radius: 50%;
  background-color: var(--c-neutral-1000);
  display: flex;
  align-items: center;
  justify-content: center;
  ${Root}:hover &, ${Root}:focus & {
    background-color: var(--c-neutral-700);
  }
  @media ${tabletAndAbove} {
    width: var(--double-unit);
    height: var(--double-unit);
    font-size: var(--intermediate-unit);
  }
`;

type Props = {
  onTrack?: () => void;
  className?: string;
};
const BeginnersGuideButton = ({ onTrack, className }: Props) => {
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const onClick = () => {
    onTrack?.();
    setShowDialog(true);
  };

  return (
    <>
      <Root onClick={onClick} color="black" className={className}>
        <IconWrapper>
          <FontAwesomeIcon aria-hidden icon={faQuestion} />
          <span className="sr-only">
            <FormattedMessage
              id="Draft.BeginnersGuideBanner.Title"
              defaultMessage="Beginners' Guide"
            />
          </span>
        </IconWrapper>
      </Root>

      {showDialog && (
        <BeginnersGuideDialog onClose={() => setShowDialog(false)} />
      )}
    </>
  );
};

export default BeginnersGuideButton;
