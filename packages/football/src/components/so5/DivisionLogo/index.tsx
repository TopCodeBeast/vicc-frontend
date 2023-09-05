import { TypedDocumentNode, gql } from '@apollo/client';
import classnames from 'classnames';
import styled from 'styled-components';

import { DivisionLogo_vicc5Leaderboard } from './__generated__/index.graphql';
import Weekly from './assets/Weekly';

const Root = styled.div`
  width: calc(5 * var(--unit));
  max-width: 100%;
  object-fit: cover;
  color: transparent;
  &.tag {
    padding: 2px;
    background-color: var(--c-static-neutral-100);
    border-radius: var(--unit);
    image {
      max-width: calc(100% - 4px);
    }
  }
`;

export type Props = {
  vicc5Leaderboard: DivisionLogo_vicc5Leaderboard;
  tag?: boolean;
};

export const DivisionLogo = ({ vicc5Leaderboard, tag }: Props) => {
  if (vicc5Leaderboard.iconUrl || vicc5Leaderboard.svgLogoUrl)
    return (
      <Root
        as="img"
        src={vicc5Leaderboard.iconUrl || vicc5Leaderboard.svgLogoUrl}
        className={classnames({ tag })}
      />
    );

  return (
    <Root className={classnames({ tag })}>
      <Weekly />
    </Root>
  );
};

DivisionLogo.fragments = {
  vicc5Leaderboard: gql`
    fragment DivisionLogo_vicc5Leaderboard on Vicc5Leaderboard {
      slug
      iconUrl
      svgLogoUrl
    }
  ` as TypedDocumentNode<DivisionLogo_vicc5Leaderboard>,
};

export default DivisionLogo;
