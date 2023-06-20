import { CSSProperties, PropsWithChildren } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  background: linear-gradient(
      180deg,
      rgba(33, 34, 41, 0.7) 12px,
      rgba(var(--c-static-rgb-neutral-900), 0) min(25%, 125px),
      var(--c-static-neutral-900) min(60%, 300px)
    ),
    top / auto min(60%, 300px) no-repeat var(--background-url);
`;

const CollectionBackground = ({
  bannerPictureUrl,
  className,
  children,
}: PropsWithChildren<{
  bannerPictureUrl: string | null;
  className?: string;
}>) => {
  return (
    <Root
      style={
        { '--background-url': `url(${bannerPictureUrl})` } as CSSProperties
      }
      className={className}
    >
      {children}
    </Root>
  );
};

export default CollectionBackground;
