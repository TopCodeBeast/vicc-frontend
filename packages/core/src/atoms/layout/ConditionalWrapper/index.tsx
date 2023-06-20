type Props = {
  wrap: boolean;
  Wrapper: React.FC<{ children: React.ReactNode }>;
  children: JSX.Element;
};

export const ConditionalWrapper = ({ wrap, Wrapper, children }: Props) =>
  wrap ? <Wrapper>{children}</Wrapper> : children;
