import { gql } from '@apollo/client';
import { faCalendar } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { ShopItemType } from '@sorare/core/src/__generated__/globalTypes';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { Container } from '@sorare/core/src/atoms/container';
import Coin from '@sorare/core/src/atoms/icons/Coin';
import ScarcityIcon from '@sorare/core/src/atoms/icons/ScarcityIcon';
import { Text14 } from '@sorare/core/src/atoms/typography';
import { buildFilterQuery } from '@sorare/core/src/components/search/InstantSearch';
import { SEARCH_PARAMS } from '@sorare/core/src/components/search/InstantSearch/types';
import DiscordUser from '@sorare/core/src/components/user/DiscordUser';
import FollowButton from '@sorare/core/src/components/user/FollowButton';
import TwitterUser from '@sorare/core/src/components/user/TwitterUser';
import { FOOTBALL_USER_GALLERY_CARDS } from '@sorare/core/src/constants/routes';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { playableBlockchainRarities } from '@sorare/core/src/lib/cards';
import { theme } from '@sorare/core/src/style/theme';

import { TradeButton } from '@sorare/marketplace/src/components/TradeButton';

import ClubShopButton from '@football/components/clubShop/ClubShopButton';
import ShopItemDialog from '@football/components/shopItems/ShopItemDialog';
import BigInfo from '@football/components/user/BigInfo';
import CoinAmount from '@football/components/user/CoinAmount';
import Follows from '@football/components/user/Follows';

import {
  UserHeader_currentUser,
  UserHeader_publicUserInfoInterface,
} from './__generated__/index.graphql';

const Camera = styled(IconButton)`
  position: absolute;
  right: 0;
  top: var(--triple-unit);
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    opacity: 0;
    &:focus {
      opacity: 1;
    }
  }
`;
const Wrapper = styled.div`
  position: relative;
  isolation: isolate;
  &:hover ${Camera} {
    opacity: 1;
  }
`;
const Actions = styled.div`
  display: flex;
  gap: var(--unit);
  width: 100%;
  justify-content: flex-end;
  order: 1;
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    width: auto;
    order: unset;
  }
`;
const FollowButtonWrapper = styled.div`
  order: -1;
  margin-right: auto;
  @media (min-width: ${theme.breakpoints.values.laptop}px) {
    order: 0;
    margin-right: unset;
  }
`;
const Details = styled.div`
  display: flex;
  gap: var(--intermediate-unit);
  flex-direction: column;
  width: 100%;
  color: var(--c-static-neutral-100);
`;
const Line = styled(Text14)`
  display: flex;
  flex-wrap: wrap;
  column-gap: var(--double-unit);
`;
const FullLine = styled.div`
  display: flex;
  gap: var(--double-unit);
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;
const Item = styled.div`
  display: flex;
  align-items: center;
  column-gap: var(--unit);
  white-space: nowrap;
`;
const Cards = styled.div`
  display: flex;
  gap: var(--unit);
`;
const Card = styled.div`
  display: flex;
  gap: var(--half-unit);
  align-items: center;
`;

type Props = {
  user: UserHeader_publicUserInfoInterface | UserHeader_currentUser;
  readOnly?: boolean;
};

export const Header = ({ user, readOnly }: Props) => {
  const {
    flags: { disableClubShopPage = false },
  } = useFeatureFlags();
  const { formatDate, formatNumber } = useIntlContext();
  const [pickingSkin, setPickingSkin] = useState<
    ShopItemType.BANNER | ShopItemType.SHIELD
  >();

  const { profile, followed, slug, cardCounts } = user;

  const shouldShowClubShopBalance =
    'coinBalance' in user && user.coinBalance > 0;
  return (
    <Wrapper className="dark-theme">
      <ShopItemDialog
        open={!readOnly && !!pickingSkin}
        type={pickingSkin}
        onClose={() => setPickingSkin(undefined)}
      />
      <Container>
        <BigInfo
          user={user}
          setPickingSkin={readOnly ? undefined : setPickingSkin}
          Camera={Camera}
          readOnly={readOnly}
        >
          <Actions>
            <FollowButtonWrapper>
              <FollowButton
                medium
                subscribable={{ __typename: 'User', slug }}
                initialSubscription={followed}
              />
            </FollowButtonWrapper>
            <TradeButton user={user} />
          </Actions>
          <Details>
            <Line as="div" color="var(--c-neutral-600)">
              <Follows user={user} />
              <Item>
                <FontAwesomeIcon icon={faCalendar} />
                <FormattedMessage
                  id="GalleryHeader.since"
                  defaultMessage="since {value}"
                  values={{ value: formatDate(user.createdAt) }}
                />
              </Item>
              <DiscordUser userProfile={profile} />
              <TwitterUser userProfile={profile} />
            </Line>
            <FullLine>
              <Cards>
                {playableBlockchainRarities.map(scarcity => {
                  return (
                    <Link
                      key={scarcity}
                      to={generatePath(
                        `${FOOTBALL_USER_GALLERY_CARDS}?${buildFilterQuery({
                          [SEARCH_PARAMS.RARITY]: scarcity,
                        })}`,
                        { slug: user.slug }
                      )}
                    >
                      <Card>
                        <ScarcityIcon scarcity={scarcity} />
                        <Text14 bold color="var(--c-static-neutral-500)">
                          {formatNumber(
                            cardCounts[
                              scarcity === 'super_rare' ? 'superRare' : scarcity
                            ]
                          )}
                        </Text14>
                      </Card>
                    </Link>
                  );
                })}
              </Cards>
              {!disableClubShopPage && !readOnly && (
                <ClubShopButton>
                  {shouldShowClubShopBalance ? (
                    <CoinAmount
                      amount={'coinBalance' in user ? user.coinBalance : 0}
                    />
                  ) : (
                    <>
                      <Coin />
                      <FormattedMessage
                        id="Header.ClubShopLink"
                        defaultMessage="Club Shop"
                      />
                    </>
                  )}
                </ClubShopButton>
              )}
            </FullLine>
          </Details>
        </BigInfo>
      </Container>
    </Wrapper>
  );
};

Header.fragments = {
  user: gql`
    fragment UserHeader_publicUserInfoInterface on PublicUserInfoInterface {
      slug
      createdAt
      followed {
        slug
      }
      cardCounts {
        limited
        rare
        superRare
        unique
      }
      profile {
        id
        fullPictureUrl: pictureUrl
        clubBanner {
          id
          color
          pictureUrl
        }
        ...DiscordUser_userProfile
        ...TwitterUser_userProfile
      }
      ...Follows_user
      ...TradeButton_publicUserInfoInterface
      ...BigInfo_user
    }
    ${TradeButton.fragments.user}
    ${DiscordUser.fragments.userProfile}
    ${TwitterUser.fragments.userProfile}
    ${Follows.fragments.user}
    ${BigInfo.fragments.user}
  `,
  currentUser: gql`
    fragment UserHeader_currentUser on CurrentUser {
      slug
      coinBalance
      createdAt
      followed {
        slug
      }
      cardCounts {
        limited
        rare
        superRare
        unique
      }
      profile {
        id
        fullPictureUrl: pictureUrl
        clubBanner {
          id
          color
          pictureUrl
        }
        ...DiscordUser_userProfile
        ...TwitterUser_userProfile
      }
      ...Follows_user
      ...TradeButton_publicUserInfoInterface
      ...BigInfo_user
    }
    ${TradeButton.fragments.user}
    ${DiscordUser.fragments.userProfile}
    ${TwitterUser.fragments.userProfile}
    ${Follows.fragments.user}
    ${BigInfo.fragments.user}
  `,
};

export default Header;
