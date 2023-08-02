import { TypedDocumentNode, gql } from '@apollo/client';
import { faClock } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { CommonDraftCampaignStatus } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import { LinkBox, LinkOverlay } from '@sorare/core/src/atoms/navigation/Box';
import {
  caption,
  text14,
  text16,
  text18,
} from '@sorare/core/src/atoms/typography';
import { FOOTBALL_DRAFT } from '@sorare/core/src/constants/routes';
import { useGeneratePathWithSearch } from '@sorare/core/src/hooks/useGeneratePathWithSearch';
import { fantasy } from '@sorare/core/src/lib/glossary';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import {
  LeagueRow_commonDraftCampaign,
  LeagueRow_competition,
} from './__generated__/index.graphql';

const Wrapper = styled.div`
  padding: var(--double-unit);
  display: flex;
  gap: var(--double-unit);
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: var(--c-neutral-200);
  &:not(:last-child) {
    border-bottom: 1px solid var(--c-neutral-400);
  }
  &.disabled {
    background-color: var(--c-neutral-200);
    opacity: 0.7;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: end;
  gap: var(--double-unit);
  flex: 1;
  @media ${tabletAndAbove} {
    align-items: center;
  }
`;

const ContentTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
  @media ${tabletAndAbove} {
    gap: var(--half-unit);
  }
`;
const StyledImg = styled.img`
  width: 40px;
  height: 40px;
`;

const FlagWrapper = styled.div`
  display: flex;
  width: var(--double-unit);
`;
const FlagImg = styled.img`
  border-radius: 2px;
  width: 100%;
`;

const AlreadyJoinedText = styled.div`
  white-space: nowrap;
  color: var(--c-neutral-600);
  ${caption}
  position:absolute;
  top: var(--double-unit);
  right: calc(2.5 * var(--unit));
  @media ${tabletAndAbove} {
    position: static;
    ${text14}
  }
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;

const Title = styled.div`
  ${text16}
  @media ${tabletAndAbove} {
    ${text18}
  }
  white-space: nowrap;
`;

const LeagueRowContent = ({
  competition,
}: {
  competition: LeagueRow_competition;
}) => {
  const { logoUrl, country } = competition;
  return (
    <ContentWrapper>
      {logoUrl && <StyledImg src={logoUrl} alt={competition.displayName} />}
      <ContentTitleWrapper>
        {country && (
          <FlagWrapper>
            <FlagImg src={country.flagUrl} alt="" />
          </FlagWrapper>
        )}
        <Title>{competition.displayName}</Title>
      </ContentTitleWrapper>
    </ContentWrapper>
  );
};

type Props = {
  commonDraftCampaign: Nullable<LeagueRow_commonDraftCampaign>;
  competition: LeagueRow_competition;
  onClick: (draftCampaignSlug: string) => void;
};

export const LeagueRow = ({
  commonDraftCampaign,
  competition,
  onClick,
}: Props) => {
  const generatePathWithSearch = useGeneratePathWithSearch();

  if (!commonDraftCampaign?.upcomingSo5Leaderboard?.slug) {
    return (
      <Wrapper className="disabled">
        <LeagueRowContent competition={competition} />
        <AlreadyJoinedText>
          <FontAwesomeIcon icon={faClock} />
          <FormattedMessage
            id="PickLeague.LeagueRow.offSeason"
            defaultMessage="Reopens in August"
          />
        </AlreadyJoinedText>
      </Wrapper>
    );
  }

  const isDisabled =
    commonDraftCampaign.status !== CommonDraftCampaignStatus.OPEN;

  if (isDisabled) {
    return (
      <Wrapper className="disabled">
        <LeagueRowContent competition={competition} />
        <AlreadyJoinedText>
          <FormattedMessage {...fantasy.alreadyJoined} />
        </AlreadyJoinedText>
      </Wrapper>
    );
  }

  return (
    <Wrapper as={LinkBox}>
      <LeagueRowContent competition={competition} />
      <LinkOverlay
        as={Button}
        component={Link}
        to={generatePathWithSearch(FOOTBALL_DRAFT, {
          slug: commonDraftCampaign.upcomingSo5Leaderboard.slug,
        })}
        onClick={() => onClick(commonDraftCampaign.slug)}
        color="blue"
        medium
        role="link"
        state={{
          sourcePage: 'pick-league',
        }}
      >
        <FormattedMessage id="LeagueRow.cta" defaultMessage="Select" />
      </LinkOverlay>
    </Wrapper>
  );
};

LeagueRow.fragments = {
  commonDraftCampaign: gql`
    fragment LeagueRow_commonDraftCampaign on CommonDraftCampaign {
      slug
      status
      upcomingSo5Leaderboard {
        slug
      }
    }
  ` as TypedDocumentNode<LeagueRow_commonDraftCampaign>,
  competition: gql`
    fragment LeagueRow_competition on Competition {
      slug
      displayName
      logoUrl
      country {
        slug
        code
        flagUrl
      }
    }
  ` as TypedDocumentNode<LeagueRow_competition>,
};
