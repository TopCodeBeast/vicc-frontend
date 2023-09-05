import { TypedDocumentNode, gql } from '@apollo/client';
import styled from 'styled-components';

import { LiveFixture } from './LiveFixture';
import { PastFixture } from './PastFixture';
import { UpcomingFixtures } from './UpcomingFixtures';
import { TournamentsTimeline_vicc5 } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--c-neutral-1000);
`;
type Props = {
  vicc5: Nullable<TournamentsTimeline_vicc5>;
  loading: boolean;
};

export const TournamentsTimeline = ({ vicc5, loading }: Props) => {
  return (
    <Wrapper>
      <PastFixture vicc5={vicc5} loading={loading} />
      <LiveFixture vicc5={vicc5} loading={loading} />
      <UpcomingFixtures vicc5={vicc5} loading={loading} />
    </Wrapper>
  );
};

TournamentsTimeline.fragments = {
  vicc5: gql`
    fragment TournamentsTimeline_vicc5 on Vicc5Root {
      ...PastFixture_vicc5
      ...LiveFixture_vicc5
      ...UpcomingFixtures_vicc5
    }
    ${PastFixture.fragments.vicc5}
    ${LiveFixture.fragments.vicc5}
    ${UpcomingFixtures.fragments.vicc5}
  ` as TypedDocumentNode<TournamentsTimeline_vicc5>,
};
