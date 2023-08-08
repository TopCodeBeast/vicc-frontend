import { TypedDocumentNode, gql } from '@apollo/client';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { Text16 } from '@sorare/core/src/atoms/typography';
import DumbClubAvatar from '@sorare/core/src/components/club/DumbClubAvatar';
import FlagAvatar from '@sorare/core/src/components/country/FlagAvatar';
import {
  FOOTBALL_CLUB_SHOW,
  FOOTBALL_COUNTRY_SHOW,
} from '@sorare/core/src/constants/routes';
import { getPositionName } from '@sorare/core/src/lib/baseball';
import { isType } from '@sorare/core/src/lib/gql';
import { toDisplayName } from '@sorare/core/src/lib/territories';

import DumbPlayerDescription from '../../DumbPlayerDescription';
import {
  FollowDescription_club,
  FollowDescription_country,
  FollowDescription_player,
} from './__generated__/index.graphql';

interface Props {
  followedItem:
    | FollowDescription_player
    | FollowDescription_club
    | FollowDescription_country;
}

const Root = styled.div`
  display: flex;
`;
const StyledFlagAvatar = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
`;
const Description = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
`;
const Avatar = styled(DumbClubAvatar)`
  width: 48px;
  height: 48px;
`;

const FollowDescription = (props: Props) => {
  const { followedItem } = props;
  if (isType(followedItem, 'Country')) {
    return (
      <Root>
        <StyledFlagAvatar>
          <FlagAvatar country={followedItem} imageRes={64} type="flat" />
        </StyledFlagAvatar>
        <Description>
          <Link
            to={generatePath(FOOTBALL_COUNTRY_SHOW, {
              slug: followedItem.slug,
            })}
          >
            <Text16 bold>{toDisplayName(followedItem.slug)}</Text16>
          </Link>
        </Description>
      </Root>
    );
  }

  if (isType(followedItem, 'Club')) {
    return (
      <Root>
        <Avatar club={followedItem} />
        <Description>
          <Link
            to={generatePath(FOOTBALL_CLUB_SHOW, { slug: followedItem.slug })}
          >
            <Text16 bold>{followedItem.name}</Text16>
          </Link>
        </Description>
      </Root>
    );
  }
  if (isType(followedItem, 'Player')) {
    return (
      <DumbPlayerDescription
        {...followedItem}
        positions={[followedItem.position]}
        activeClubName={followedItem.activeClub?.name}
        sport={Sport.FOOTBALL}
      />
    );
  }

  return null;
};

FollowDescription.fragments = {
  club: gql`
    fragment FollowDescription_club on Club {
      slug
      name
      avatarUrl: pictureUrl(derivative: "avatar")
    }
  ` as TypedDocumentNode<FollowDescription_club>,
  country: gql`
    fragment FollowDescription_country on Country {
      slug
    }
  ` as TypedDocumentNode<FollowDescription_country>,
  player: gql`
    fragment FollowDescription_player on Player {
      slug
      displayName
      position: positionTyped
      activeClub {
        slug
        name
      }
      shirtNumber
      avatarImageUrl: pictureUrl(derivative: "avatar")
    }
  ` as TypedDocumentNode<FollowDescription_player>,
};

export default FollowDescription;
