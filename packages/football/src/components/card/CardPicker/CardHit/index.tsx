import { gql } from '@apollo/client';
import { faCheckSquare } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import styled from 'styled-components';

import Clickable from '@sorare/core/src/atoms/buttons/Clickable';

import FlexToken from '@sorare/marketplace/src/components/token/FlexToken';

import { CardHit_token } from './__generated__/index.graphql';

interface Props {
  hit: CardHit_token;
  selected: boolean;
  onToggle: () => void;
}

const Root = styled(Clickable)`
  border-radius: 8px;
  padding: 2px;
  &.selected {
    border: 2px solid var(--c-brand-600);
  }
`;
const Selected = styled(FontAwesomeIcon)`
  position: absolute;
  right: 10px;
  bottom: 10px;
`;

export const CardHit = ({ hit, selected, onToggle }: Props) => {
  return (
    <Root onClick={onToggle} className={classnames({ selected })}>
      <FlexToken token={hit} />
      {selected && <Selected icon={faCheckSquare} />}
    </Root>
  );
};

CardHit.displayName = 'CardHit';

CardHit.fragments = {
  token: gql`
    fragment CardHit_token on Token {
      assetId
      slug
      ...FlexToken_token
    }
    ${FlexToken.fragments.token}
  `,
};

export default CardHit;
