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
  ComposeTeamDraftHeader_so5Leaderboard,
  ComposeTeamDraftHeader_so5Lineup,
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
  so5Leaderboard?: ComposeTeamDraftHeader_so5Leaderboard;
  so5Lineup: Nullable<ComposeTeamDraftHeader_so5Lineup>;
  Back: FC<React.PropsWithChildren<unknown>>;
  renderExtra?: (props: FC<React.PropsWithChildren<unknown>>) => ReactNode;
};
const Header = ({ so5Leaderboard, so5Lineup, Back, renderExtra }: Props) => {
  const { formatMessage } = useIntl();
  if (!so5Leaderboard) {
    return null;
  }
  return (
    <Root>
      <Logo>
        <DivisionLogo so5Leaderboard={so5Leaderboard} tag />
        <div>
          <Subtitle>
            {scarcityMessages[so5Leaderboard.rarityType as ScarcityType] && (
              <FormattedMessage
                {...scarcityMessages[so5Leaderboard.rarityType as ScarcityType]}
              />
            )}
            <span>•</span>
            <Period
              start={so5Leaderboard.so5Fixture.startDate}
              end={so5Leaderboard.so5Fixture.endDate}
            />
          </Subtitle>
          <CompetitionName>
            <Title3>{getLineupDisplayName(so5Lineup, so5Leaderboard)}</Title3>
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
  so5Leaderboard: gql`
    fragment ComposeTeamDraftHeader_so5Leaderboard on So5Leaderboard {
      slug
      displayName
      rarityType
      so5Fixture {
        slug
        startDate
        endDate
      }
      ...DivisionLogo_so5Leaderboard
      ...getLineupDisplayName_so5Leaderboard
    }
    ${DivisionLogo.fragments.so5Leaderboard}
    ${getLineupDisplayName.fragments.so5Leaderboard}
  ` as TypedDocumentNode<ComposeTeamDraftHeader_so5Leaderboard>,
  so5Lineup: gql`
    fragment ComposeTeamDraftHeader_so5Lineup on So5Lineup {
      id
      ...getLineupDisplayName_so5Lineup
    }
    ${getLineupDisplayName.fragments.so5Lineup}
  ` as TypedDocumentNode<ComposeTeamDraftHeader_so5Lineup>,
};
