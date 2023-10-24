import { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { ComposeTeamLayout } from '@sorare/core/src/components/composeTeam/ComposeTeamLayout';
import {
  FRONTEND_ASSET_HOST,
  STADIUM_ANIMATION,
} from '@sorare/core/src/constants/assets';

import Bench, { Props as BenchProps } from './Bench';
import Drawer, { Props as DrawerProps } from './Drawer';
import Field, { Props as FieldProps } from './Field';

type Props = {
  header?: ReactNode;
  lineupHeader?: ReactNode;
  bench: (props: FC<React.PropsWithChildren<BenchProps>>) => ReactNode;
  lineup: (props: FC<React.PropsWithChildren<FieldProps>>) => ReactNode;
  drawer: (props: FC<React.PropsWithChildren<DrawerProps>>) => ReactNode;
  onConfirm?: () => void;
  stall?: boolean;
  disableAnimation?: boolean;
};
const BenchWrapper = styled.div`
  padding: var(--double-unit);
  overflow: auto;
  max-height: 100vh;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  background: var(--c-neutral-100);
  margin-bottom: var(--unit);
`;

const DumbComposeTeam = ({
  header,
  lineupHeader,
  bench,
  lineup,
  drawer,
  stall,
  disableAnimation = false,
}: Props) => (
  <ComposeTeamLayout
    lineupHeader={lineupHeader}
    stall={stall}
    disableAnimation={disableAnimation}
    video={STADIUM_ANIMATION}
    poster={`/assets/fields/fallback.jpg`}
    bench={
      <BenchWrapper>
        <Header>{header}</Header>
        {bench(Bench)}
      </BenchWrapper>
    }
    drawer={drawer ? drawer(Drawer) : undefined}
    lineup={lineup(Field)}
  />
);

export default DumbComposeTeam;
