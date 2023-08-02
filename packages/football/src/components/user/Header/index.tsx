import { TypedDocumentNode, gql } from '@apollo/client';
import { faCalendar } from '@fortawesome/pro-regular-svg-icons';
import { faCartShopping } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, generatePath } from 'react-router-dom';
import styled from 'styled-components';

import { ShopItemType } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
// eslint-disable-next-line sorare/no-unrendered-component-imports
import { Container } from '@sorare/core/src/atoms/container';
import Coin from '@sorare/core/src/atoms/icons/Coin';
import ScarcityIcon from '@sorare/core/src/atoms/icons/ScarcityIcon';
import { Text14 } from '@sorare/core/src/atoms/typography';
import ClubShopButtonBase from '@sorare/core/src/components/clubShop/ClubShopButton';
import CoinAmount from '@sorare/core/src/components/clubShop/CoinAmount';
import { buildFilterQuery } from '@sorare/core/src/components/search/InstantSearch';
import { SEARCH_PARAMS } from '@sorare/core/src/components/search/InstantSearch/types';
import DiscordUser from '@sorare/core/src/components/user/DiscordUser';
import FollowButton from '@sorare/core/src/components/user/FollowButton';
import TwitterUser from '@sorare/core/src/components/user/TwitterUser';
import {
  FOOTBALL_CLUB_SHOP,
  FOOTBALL_USER_GALLERY_CARDS,
} from '@sorare/core/src/constants/routes';
import { useIntlContext } from '@sorare/core/src/contexts/intl';
import { useIsDesktop } from '@sorare/core/src/hooks/device/useIsDesktop';
import useIsReorgApp from '@sorare/core/src/hooks/ui/useIsReorgApp';
import useFeatureFlags from '@sorare/core/src/hooks/useFeatureFlags';
import { playableBlockchainRarities } from '@sorare/core/src/lib/cards';
import { navLabels } from '@sorare/core/src/lib/glossary';
import { laptopAndAbove } from '@sorare/core/src/style/mediaQuery';

import { TradeButton } from '@sorare/marketplace/src/components/TradeButton';

import ShopItemDialog from '@football/components/shopItems/ShopItemDialog';
import BigInfo from '@football/components/user/BigInfo';
import Follows from '@football/components/user/Follows';

import {
  UserHeader_currentUser,
  UserHeader_publicUserInfoInterface,
} from './__generated__/index.graphql';

const Camera = styled(IconButton)`
  position: absolute;
  right: 0;
  top: var(--triple-unit);
  @media ${laptopAndAbove} {
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
  @media ${laptopAndAbove} {
    width: auto;
    order: unset;
  }
`;
const FollowButtonWrapper = styled.div`
  order: -1;
  margin-right: auto;
  @media ${laptopAndAbove} {
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

const StyledButton = styled(Button)`
  display: inline-flex;
`;
const ClubShopButton = ({
  readOnly,
  user,
}: {
  readOnly?: boolean;
  user: UserHeader_publicUserInfoInterface | UserHeader_currentUser;
}) => {
  const {
    flags: { disableClubShopPage = false },
  } = useFeatureFlags();
  const isDesktop = useIsDesktop();
  const isReorgApp = useIsReorgApp();
  const shouldShowClubShopBalance =
    'coinBalance' in user && user.coinBalance > 0;
  if (disableClubShopPage || readOnly) {
    return null;
  }

  if (isReorgApp) {
    return (
      <StyledButton
        color="white"
        small={!isDesktop}
        medium={isDesktop}
        to={FOOTBALL_CLUB_SHOP}
        component={Link}
        startIcon={<FontAwesomeIcon icon={faCartShopping} />}
      >
        {isDesktop && <FormattedMessage {...navLabels.clubshop} />}
      </StyledButton>
    );
  }

  return (
    <ClubShopButtonBase to={FOOTBALL_CLUB_SHOP}>
      {shouldShowClubShopBalance ? (
        <CoinAmount amount={'coinBalance' in user ? user.coinBalance : 0} />
      ) : (
        <>
          <Coin />
          <FormattedMessage
            id="Header.ClubShopLink"
            defaultMessage="Club Shop"
          />
        </>
      )}
    </ClubShopButtonBase>
  );
};

type Props = {
  user: UserHeader_publicUserInfoInterface | UserHeader_currentUser;
  readOnly?: boolean;
};

const ReorgHeaderContent = styled.div`
  padding: 0 var(--double-unit);
  @media ${laptopAndAbove} {
    padding: var(--double-unit) var(--quadruple-unit);
  }
`;

export const Header = ({ user, readOnly }: Props) => {
  const { formatDate, formatNumber } = useIntlContext();
  const isReorgApp = useIsReorgApp();
  const [pickingSkin, setPickingSkin] = useState<
    ShopItemType.BANNER | ShopItemType.SHIELD
  >();

  const { profile, followed, slug, cardCounts } = user;

  const ContentWrapper = isReorgApp ? ReorgHeaderContent : Container;
  return (
    <Wrapper className="dark-theme">
      <ShopItemDialog
        open={!readOnly && !!pickingSkin}
        type={pickingSkin}
        onClose={() => setPickingSkin(undefined)}
      />
      <ContentWrapper>
        <BigInfo
          user={user}
          setPickingSkin={readOnly ? undefined : setPickingSkin}
          Camera={Camera}
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
              <ClubShopButton user={user} readOnly={readOnly} />
            </FullLine>
          </Details>
        </BigInfo>
      </ContentWrapper>
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
  ` as TypedDocumentNode<UserHeader_publicUserInfoInterface>,
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
  ` as TypedDocumentNode<UserHeader_currentUser>,
};

export default Header;
