type Props = {
  wrap: boolean;
  Wrapper: React.FC<React.PropsWithChildren<{ children: React.ReactNode }>>;
  children: React.JSX.Element;
};

export const ConditionalWrapper = ({ wrap, Wrapper, children }: Props) =>
  wrap ? <Wrapper>{children}</Wrapper> : children;
