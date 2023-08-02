import styled from 'styled-components';

import { Position } from '@sorare/core/src/__generated__/globalTypes';

import { PickerCard } from '@football/components/draft/PickerCard';

const Root = styled.div`
  display: inline-grid;
  column-gap: var(--intermediate-unit);
  row-gap: var(--double-unit);
  height: 100%;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, min-content);
  align-content: center;
  pointer-events: none;
`;

type Props = {
  avatarUrl: string;
  playerDisplayName: string;
};

export const Onboarding1 = ({ avatarUrl, playerDisplayName }: Props) => (
  <Root>
    <PickerCard
      position={Position.Forward}
      drafted={{
        value: 61,
        avatarUrl,
        player: {
          displayName: playerDisplayName,
        },
      }}
    />

    <PickerCard position={Position.Midfielder} />
    <PickerCard position={Position.Defender} />
    <PickerCard position={Position.Goalkeeper} />
    <PickerCard position={Position.Forward} active />
    <PickerCard position={Position.Midfielder} />
    <PickerCard position={Position.Defender} />
    <PickerCard position={Position.Goalkeeper} />
  </Root>
);
