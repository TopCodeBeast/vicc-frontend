import { ReactNode } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: var(--double-unit);
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  background-color: var(--c-neutral-200);
  ${props =>
    props.theme.hoverable
      ? `&:hover {
      background-color: var(--c-neutral-300);
    }`
      : ''}
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

type Props = {
  id: string;
  StatusRow: ReactNode;
  FirstTeamRow: ReactNode;
  SecondTeamRow: ReactNode;
  hoverable?: boolean;
  className?: string;
};

export const Game = ({
  StatusRow,
  FirstTeamRow,
  SecondTeamRow,
  hoverable = false,
  className,
}: Props) => {
  return (
    <Wrapper theme={{ hoverable }} className={className}>
      <Line>{StatusRow}</Line>
      <Line>{FirstTeamRow}</Line>
      <Line>{SecondTeamRow}</Line>
    </Wrapper>
  );
};
