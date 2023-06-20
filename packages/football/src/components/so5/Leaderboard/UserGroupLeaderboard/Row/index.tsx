import { gql } from '@apollo/client';
import styled from 'styled-components';

import { Text16 } from '@sorare/core/src/atoms/typography';
import Avatar from '@sorare/core/src/components/user/Avatar';
import { Nickname } from '@sorare/core/src/components/user/Nickname';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { theme } from '@sorare/core/src/style/theme';

import ClubShield from '@sorare/football/src/components/user/ClubShield';

import {
  Row_so5UserGroupMembership,
  Row_user,
} from './__generated__/index.graphql';

type Row_so5UserGroupMembership_liveSo5Ranking = NonNullable<
  Row_so5UserGroupMembership['liveSo5Ranking']
>;

const Root = styled.button.attrs(({ $highlight }: { $highlight: boolean }) => ({
  className: $highlight ? 'highlight' : '',
}))<{ $highlight: boolean }>`
  position: relative;
  padding: var(--unit);
  display: grid;
  grid: repeat(2, 1fr) / 40px 9fr 2fr 3fr;
  align-items: center;
  width: 100%;
  grid-template-areas:
    'manager manager score total'
    'manager manager score total';
  background-color: var(--c-neutral-300);
  border-radius: ${theme.radius.md}px;
  text-align: left;
  color: inherit;

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    grid-template-columns: 58px 10fr 1fr 1fr;
    padding: var(--double-unit) var(--unit);
    grid-template-areas:
      'rank manager score total'
      'rank manager score total';
  }
  @media (min-width: ${theme.breakpoints.values.desktop}px) {
    grid-template-columns: 58px 15fr 1fr 1fr;
    padding: var(--double-unit) var(--unit);
  }
  & > * {
    position: relative;
    z-index: 1;
  }
  &.highlight {
    outline: 2px solid var(--c-brand-600);
    background-color: rgba(var(--c-rgb-brand-600), 0.4);
  }
  &:hover,
  &:focus {
    color: inherit;
    background-color: rgba(var(--c-rgb-neutral-300), 0.8);
    &.highlight {
      background-color: rgba(var(--c-rgb-brand-600), 0.35);
    }
  }
`;
const AvatarWrapper = styled.div`
  grid-area: avatar;
`;
const Rank = styled.div`
  display: none;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    display: block;
    grid-area: rank;
    text-align: center;
    font-size: var(--t-14);
  }
`;
const RankOnMobile = styled.div`
  grid-area: 'rank';
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    display: none;
  }
`;
const Manager = styled.div`
  grid-area: manager;
  display: grid;
  grid-template-columns: 40px auto;
  column-gap: var(--unit);
  grid-template-areas:
    'avatar rank'
    'avatar name';
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    grid-template-areas:
      'avatar name'
      'avatar club';
  }
`;
const Name = styled.div`
  grid-area: name;
  font: var(--t-16);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Club = styled.div`
  display: none;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    grid-area: club;
    display: flex;
    align-items: center;
    overflow: hidden;
    gap: var(--half-unit);
  }
`;
const ClubShieldStyled = styled(ClubShield)`
  margin-right: var(--half-unit);
`;
const ClubName = styled(Text16)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Score = styled(Text16)`
  display: flex;
  flex-direction: column;
  grid-area: score;
  text-align: center;
`;
const Total = styled(Text16)`
  display: flex;
  flex-direction: column;
  grid-area: total;
  text-align: center;
`;

type Props = {
  manager: {
    ranking: number;
    score: number;
    liveScore: number;
    liveSo5Ranking: Row_so5UserGroupMembership_liveSo5Ranking | null;
    user: Row_user;
  };
  highlight: boolean;
  onClick: (
    liveRanking?: Row_so5UserGroupMembership_liveSo5Ranking | null
  ) => void;
};
const Row = ({ manager, highlight, onClick }: Props) => {
  const { ranking, score, liveScore, liveSo5Ranking, user } = manager;
  const { formatNumber } = useIntlContext();

  return (
    <Root
      $highlight={highlight}
      type="button"
      onClick={() => onClick(liveSo5Ranking)}
      style={{
        cursor: liveSo5Ranking ? 'pointer' : 'normal',
      }}
    >
      <>
        <Rank>
          <strong>{ranking}</strong>
        </Rank>
        <Manager>
          <AvatarWrapper>
            <Avatar variant="medium" user={user} />
          </AvatarWrapper>
          <RankOnMobile>#{ranking}</RankOnMobile>
          <Name>
            <strong>
              <Nickname user={user} />
            </strong>
          </Name>
          <Club>
            <ClubShieldStyled size="small" userProfile={user.profile} />
            <ClubName>{user.profile.clubName}</ClubName>
          </Club>
        </Manager>
        <Score>
          <strong>{formatNumber(liveScore)}</strong>
        </Score>
        <Total>
          <strong>{formatNumber(score)}</strong>
        </Total>
      </>
    </Root>
  );
};

Row.fragments = {
  user: gql`
    fragment Row_user on PublicUserInfoInterface {
      slug
      id
      ...Avatar_publicUserInfoInterface
      profile {
        id
        clubName
        clubBanner {
          id
          pictureUrl
        }
        ...ClubShield_userProfile
      }
    }
    ${Avatar.fragments.publicUserInfoInterface}
    ${ClubShield.fragments.userProfile}
  `,
  so5UserGroupMembership: gql`
    fragment Row_so5UserGroupMembership on So5UserGroupMembership {
      id
      ranking
      score
      liveSo5Ranking {
        id
        score
        so5Lineup {
          id
        }
      }
    }
  `,
};

export default Row;
