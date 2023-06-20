import { gql } from '@apollo/client';
import { ForwardRefExoticComponent, RefAttributes, forwardRef } from 'react';
import styled from 'styled-components';

import { ValidWidths } from '@sorare/core/src/atoms/ui/ResponsiveImg';
import OpenItemDialogLink from '@sorare/core/src/components/link/OpenItemDialogLink';
import UninteractiveToken, {
  DraggableProps,
} from '@sorare/core/src/components/token/UninteractiveToken';

import { useMarketplaceContext } from 'contexts/Marketplace';

import { FlexToken_token } from './__generated__/index.graphql';

export type FlexTokenDraggableProps = DraggableProps;

interface Token extends Omit<FlexToken_token, '__typename'> {
  __typename: 'Card' | 'Token' | 'BaseballCard' | 'NBACard';
}

export interface FlexTokenProps {
  token: Token;
  withLink?: boolean;
  draggableProps?: FlexTokenDraggableProps;
  width?: ValidWidths;
}

const Root = styled(OpenItemDialogLink)`
  width: 100%;
  display: block;
  background-color: transparent;
  position: relative;
`;

export const FlexToken: {
  fragments?: any;
} & ForwardRefExoticComponent<FlexTokenProps & RefAttributes<HTMLDivElement>> =
  forwardRef<HTMLDivElement, FlexTokenProps>((props, ref) => {
    const { token, withLink, draggableProps, width } = props;
    const { trackClickCard } = useMarketplaceContext() || {
      trackClickCard: () => {},
    };

    if (withLink)
      return (
        <Root
          item={token}
          onClick={() => trackClickCard(token.assetId, token.sport)}
          sport={token.sport}
        >
          <UninteractiveToken
            token={token}
            draggableProps={draggableProps}
            ref={ref}
            width={width}
          />
        </Root>
      );
    return (
      <Root as="div">
        <UninteractiveToken
          token={token}
          draggableProps={draggableProps}
          ref={ref}
          width={width}
        />
      </Root>
    );
  });
FlexToken.displayName = 'FlexToken';

FlexToken.fragments = {
  token: gql`
    fragment FlexToken_token on Token {
      assetId
      slug
      sport
      ...UninteractiveToken_token
    }
    ${UninteractiveToken.fragments.token!}
  `,
};

export default FlexToken;
