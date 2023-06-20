import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Text14, Text16, Text20 } from '@sorare/core/src/atoms/typography';
import { CLUB_PLACEHOLDER } from '@sorare/core/src/constants/assets';
import { theme } from '@sorare/core/src/style/theme';

import { GameEventStatus } from 'lib/so5';

const Team = styled.div<{ $lost: boolean }>`
  display: flex;
  align-items: center;
  gap: var(--unit);
  width: 100%;
  color: ${({ $lost }) => {
    if ($lost) {
      return 'var(--c-neutral-600)';
    }
    return 'var(--c-neutral-1000)';
  }};
`;

const Score = styled(Text20)<{ $lost: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--quadruple-unit);
  color: ${({ $lost }) => {
    if ($lost) {
      return 'var(--c-neutral-600)';
    }
    return 'var(--c-neutral-1000)';
  }};
`;

const Code = styled.span`
  display: inline-block;
  @media (min-width: ${theme.breakpoints.values.mobile}px) {
    display: none;
  }
`;

const Label = styled(Text16)`
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
`;

const Name = styled.span`
  display: none;
  @media (min-width: ${theme.breakpoints.values.mobile}px) {
    display: inline-block;
    white-space: nowrap;
    max-width: calc(100% - var(--unit));
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

const Img = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
`;

const Pso = styled(Text14)`
  white-space: nowrap;
`;

type Props = {
  score: number;
  lost: boolean;
  name: string;
  code: string;
  pictureUrl: string;
  status: GameEventStatus;
  penaltiesScore?: number | null;
  otherPenaltiesScore?: number | null;
};

export const TeamRow = ({
  status,
  lost,
  name,
  code,
  score,
  pictureUrl,
  penaltiesScore,
  otherPenaltiesScore,
}: Props) => {
  const showScore = [
    GameEventStatus.PLAYING,
    GameEventStatus.PLAYED,
    GameEventStatus.SUSPENDED,
  ].includes(status as GameEventStatus);
  const emptyScorePlaceholder = status === GameEventStatus.CANCELLED ? '-' : '';

  return (
    <>
      <Team $lost={lost}>
        <Img
          src={pictureUrl}
          onError={e => {
            (e.target as any).src = CLUB_PLACEHOLDER;
          }}
          alt=""
        />
        <Label bold>
          <Name>{name}</Name>
          <Code>{code}</Code>
        </Label>
        {showScore &&
          penaltiesScore &&
          otherPenaltiesScore &&
          penaltiesScore > otherPenaltiesScore && (
            <Pso>
              <FormattedMessage
                id="TeamRow.penalties"
                defaultMessage="(PSO {penaltiesScore}-{otherPenaltiesScore})"
                values={{
                  penaltiesScore,
                  otherPenaltiesScore,
                }}
              />
            </Pso>
          )}
      </Team>
      <Score $lost={lost}>
        <strong> {showScore ? score : emptyScorePlaceholder}</strong>
      </Score>
    </>
  );
};
