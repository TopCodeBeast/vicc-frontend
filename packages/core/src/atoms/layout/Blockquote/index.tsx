import styled from 'styled-components';

import { backgroundColors, borderColor, fontColor } from './styles';
import { VariantType } from './types';

const Root = styled.div<{ variant: VariantType }>`
  --border-size: 4px;
  color: ${({ variant }) => fontColor[variant]};
  background-color: ${({ variant }) => backgroundColors[variant]};
  border-left: var(--border-size) solid ${({ variant }) => borderColor[variant]};
  border-radius: var(--border-size);
  padding: var(--unit);
`;

type Props = {
  children?: React.ReactNode;
  variant?: VariantType;
};

const Blockquote = ({ children, variant = 'grey' }: Props) => {
  return <Root variant={variant}>{children}</Root>;
};

export default Blockquote;
