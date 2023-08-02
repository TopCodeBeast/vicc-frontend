import { TypedDocumentNode, gql } from '@apollo/client';
import { ButtonBaseProps } from '@material-ui/core';
import styled from 'styled-components';

import FavoriteHeartButton from '@sorare/core/src/components/favorites/FavoriteHeartButton';
import { favoriteCardType } from '@sorare/core/src/contexts/follow/Provider';

import { TokenFavoriteButton_token } from './__generated__/index.graphql';

interface Props extends ButtonBaseProps {
  token: TokenFavoriteButton_token;
  show?: boolean;
  solid?: boolean;
  className?: string;
}

const AnimatedWrapper = styled.div<{
  $show?: boolean;
}>`
  transition: opacity 0.2s ease-in-out;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  visibility: ${({ $show }) => ($show ? 'visible' : 'hidden')};
`;

const TokenFavoriteButton = (props: Props) => {
  const { token, show = false, solid = true } = props;
  const subscribable = {
    __typename: favoriteCardType[token.sport],
    slug: token.slug,
  };

  return (
    <AnimatedWrapper $show={show}>
      <FavoriteHeartButton small subscribable={subscribable} solid={solid} />
    </AnimatedWrapper>
  );
};

TokenFavoriteButton.fragments = {
  token: gql`
    fragment TokenFavoriteButton_token on Token {
      assetId
      slug
      sport
    }
  ` as TypedDocumentNode<TokenFavoriteButton_token>,
};

export default TokenFavoriteButton;
