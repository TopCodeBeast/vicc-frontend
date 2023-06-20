import { faChevronLeft, faTimes } from '@fortawesome/pro-solid-svg-icons';
import styled from 'styled-components';

import IconButton, { Props as IconButtonProps } from '@sorare/core/src/atoms/buttons/IconButton';

export const IconTypes = ['close', 'back'] as const;

type IconType = (typeof IconTypes)[number];

const faIcons: Record<IconType, Required<IconButtonProps['icon']>> = {
  close: faTimes,
  back: faChevronLeft,
};

export interface Props
  extends Omit<IconButtonProps, 'color' | 'icon' | 'component'> {
  icon: IconType;
}

const StyledButton = styled(IconButton).attrs({
  color: 'transparent',
})`
  --variantColor: rgba(0, 0, 0, 0.1);
`;

const MetalabButton = ({ icon, ...rest }: Props) => {
  return <StyledButton icon={faIcons[icon]} {...rest} />;
};

export default MetalabButton;
