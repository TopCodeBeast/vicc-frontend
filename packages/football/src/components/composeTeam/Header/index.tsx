import { TypedDocumentNode, gql } from '@apollo/client';
import { faXmark } from '@fortawesome/pro-solid-svg-icons';
import { FC, ReactNode } from 'react';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { Caption, Title3 } from '@sorare/core/src/atoms/typography';
import { glossary } from '@sorare/core/src/lib/glossary';
import { ScarcityType, scarcityMessages } from '@sorare/core/src/lib/scarcity';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import DivisionLogo from '@football/components/so5/DivisionLogo';
import getLineupDisplayName from '@football/lib/lineup/getLineupDisplayName';

import {
  ComposeTeamDraftHeader_vicc5Leaderboard,
  ComposeTeamDraftHeader_vicc5Lineup,
} from './__generated__/index.graphql';

const Root = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  color: var(--c-neutral-1000);
`;

const Logo = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: center;
`;

const Subtitle = styled(Caption)`
  display: flex;
  gap: var(--unit);
  opacity: 0.8;
`;
const PeriodWrapper = styled.span`
  display: flex;
  gap: var(--half-unit);
`;

const Extra = styled.div`
  display: flex;
  gap: var(--unit);
  > * {
    background: var(--c-neutral-900);
    border-radius: 2em;
    padding: var(--half-unit);
    @media ${laptopAndAbove} {
      padding: var(--half-unit) var(--double-unit);
    }
  }
`;

const CompetitionName = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
  @media ${laptopAndAbove} {
    gap: var(--double-unit);
  }
`;

const ExtraWrapper = styled.div`
  @media ${laptopAndAbove} {
    display: none;
  }
`;

const BackButtonWrapper = styled.div`
  @media ${laptopAndAbove} {
    display: none;
  }
`;

const Period = ({ start, end }: { start: string; end: string }) => {
  return (
    <PeriodWrapper>
      <FormattedDate value={start} month="short" day="2-digit" />
      <span>-</span>
      <FormattedDate value={end} month="short" day="2-digit" />
    </PeriodWrapper>
  );
};

type Props = {
  vicc5Leaderboard?: ComposeTeamDraftHeader_vicc5Leaderboard;
  vicc5Lineup: Nullable<ComposeTeamDraftHeader_vicc5Lineup>;
  Back: FC<React.PropsWithChildren<unknown>>;
  renderExtra?: (props: FC<React.PropsWithChildren<unknown>>) => ReactNode;
};
const Header = ({ vicc5Leaderboard, vicc5Lineup, Back, renderExtra }: Props) => {
  const { formatMessage } = useIntl();
  if (!vicc5Leaderboard) {
    return null;
  }
  return (
    <Root>
      <Logo>
        <DivisionLogo vicc5Leaderboard={vicc5Leaderboard} tag />
        <div>
          <Subtitle>
            {scarcityMessages[vicc5Leaderboard.rarityType as ScarcityType] && (
              <FormattedMessage
                {...scarcityMessages[vicc5Leaderboard.rarityType as ScarcityType]}
              />
            )}
            <span>•</span>
            <Period
              start={vicc5Leaderboard.vicc5Fixture.startDate}
              end={vicc5Leaderboard.vicc5Fixture.endDate}
            />
          </Subtitle>
          <CompetitionName>
            <Title3>{getLineupDisplayName(vicc5Lineup, vicc5Leaderboard)}</Title3>
            <ExtraWrapper>{renderExtra?.(Extra)}</ExtraWrapper>
          </CompetitionName>
        </div>
      </Logo>
      <BackButtonWrapper>
        <Back>
          <IconButton
            component="span"
            icon={faXmark}
            color="white"
            aria-label={formatMessage(glossary.close)}
          />
        </Back>
      </BackButtonWrapper>
    </Root>
  );
};

export default Header;

Header.fragments = {
  vicc5Leaderboard: gql`
    fragment ComposeTeamDraftHeader_vicc5Leaderboard on Vicc5Leaderboard {
      slug
      displayName
      rarityType
      vicc5Fixture {
        slug
        startDate
        endDate
      }
      ...DivisionLogo_vicc5Leaderboard
      ...getLineupDisplayName_vicc5Leaderboard
    }
    ${DivisionLogo.fragments.vicc5Leaderboard}
    ${getLineupDisplayName.fragments.vicc5Leaderboard}
  ` as TypedDocumentNode<ComposeTeamDraftHeader_vicc5Leaderboard>,
  vicc5Lineup: gql`
    fragment ComposeTeamDraftHeader_vicc5Lineup on Vicc5Lineup {
      id
      ...getLineupDisplayName_vicc5Lineup
    }
    ${getLineupDisplayName.fragments.vicc5Lineup}
  ` as TypedDocumentNode<ComposeTeamDraftHeader_vicc5Lineup>,
};
