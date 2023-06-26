import { gql } from '@apollo/client';
import { faBars } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ForwardRefExoticComponent,
  HTMLAttributes,
  RefAttributes,
  forwardRef,
  useState,
} from 'react';
import styled from 'styled-components';

import { ValidWidths } from '@core/atoms/ui/ResponsiveImg';
import { CardImg, CardImgLoadingWrapper } from '@core/components/card/CardImg';
import { theme } from '@core/style/theme';

export type DraggableProps = HTMLAttributes<HTMLDivElement>;

interface ClickHandlerProps {
  onClick?: () => void;
}

interface IProps {
  token: {
    slug: string;
    pictureUrl?: string | null;
  };
  draggableProps?: DraggableProps;
  width?: ValidWidths;
}

const Bars = styled.div`
  position: absolute;
  top: var(--unit);
  right: var(--unit);
  touch-action: none;
  cursor: move;
  transition: var(--fade-in);
  background-color: white;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    opacity: 0;
  }
`;

const InnerContainer = styled(CardImgLoadingWrapper)`
  transform-origin: bottom center;
  position: relative;
  width: 100%;
  text-align: center;

  &:hover ${Bars} {
    opacity: 1;
  }
`;

const FrontPicture = styled(CardImg)<{ $loaded: boolean }>`
  opacity: ${({ $loaded }) => ($loaded ? '1' : '0')};
  display: inline-block;
  width: 100%;
  height: 100%;
`;

export const UninteractiveToken: {
  fragments?: any;
} & ForwardRefExoticComponent<
  IProps & ClickHandlerProps & RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, IProps & ClickHandlerProps>((props, ref) => {
  const [loaded, setLoaded] = useState(false);
  const { token, draggableProps, width = 320, onClick } = props;
  const { pictureUrl, slug } = token;

  return (
    <InnerContainer ref={ref} loaded={loaded}>
      {draggableProps && (
        <Bars {...draggableProps}>
          <FontAwesomeIcon icon={faBars} />
        </Bars>
      )}
      <FrontPicture
        loading="lazy"
        src={pictureUrl || undefined}
        alt={slug}
        draggable={false}
        onLoad={() => {
          setLoaded(true);
        }}
        $loaded={loaded}
        onClick={onClick}
        width={width}
      />
    </InnerContainer>
  );
});
UninteractiveToken.displayName = 'UninteractiveToken';

UninteractiveToken.fragments = {
  token: gql`
    fragment UninteractiveToken_token on Token {
      assetId
      slug
      pictureUrl(derivative: "tinified")
    }
  `,
};

export default UninteractiveToken;
