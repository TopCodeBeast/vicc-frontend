import { gql } from '@apollo/client';
import styled from 'styled-components';

import { LiveFixture } from './LiveFixture';
// import { PastFixture } from './PastFixture';
// import { UpcomingFixtures } from './UpcomingFixtures';
import { TournamentsTimeline_so5 } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: var(--c-neutral-1000);
`;
type Props = {
  so5: Nullable<TournamentsTimeline_so5>;
  loading: boolean;
};

export const TournamentsTimeline = ({ so5, loading }: Props) => {
  return (
    <Wrapper>
      {/* <PastFixture so5={so5} loading={loading} /> */}
      <LiveFixture so5={so5} loading={loading} />
      {/* <UpcomingFixtures so5={so5} loading={loading} /> */}
    </Wrapper>
  );
};

TournamentsTimeline.fragments = {
  so5: gql`
    fragment TournamentsTimeline_so5 on Vicc5Root {
      #...PastFixture_so5
      ...LiveFixture_so5
      #...UpcomingFixtures_so5
    }
    #{PastFixture.fragments.so5}
    ${LiveFixture.fragments.so5}
    #{UpcomingFixtures.fragments.so5}
  `,
};
