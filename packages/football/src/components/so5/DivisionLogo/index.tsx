import { gql } from '@apollo/client';
import classnames from 'classnames';
import styled from 'styled-components';

import { DivisionLogo_so5Leaderboard } from './__generated__/index.graphql';
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
  so5Leaderboard: DivisionLogo_so5Leaderboard;
  tag?: boolean;
};

export const DivisionLogo = ({ so5Leaderboard, tag }: Props) => {
  if (so5Leaderboard.iconUrl || so5Leaderboard.svgLogoUrl)
    return (
      <Root
        as="img"
        src={so5Leaderboard.iconUrl || so5Leaderboard.svgLogoUrl}
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
  so5Leaderboard: gql`
    fragment DivisionLogo_so5Leaderboard on Vicc5Leaderboard {
      slug
      iconUrl
      svgLogoUrl
    }
  `,
};

export default DivisionLogo;
