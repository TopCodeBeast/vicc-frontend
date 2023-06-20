import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const Content = ({ children, ...rest }: Props) => (
  <div {...rest}>{children}</div>
);

export default Content;
