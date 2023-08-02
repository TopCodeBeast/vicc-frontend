import { gql } from '@apollo/client';
import { faBaseball, faBasketball } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { parseISO } from 'date-fns';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Rarity, Sport } from '@sorare/core/src/__generated__/globalTypes';
import Button from '@sorare/core/src/atoms/buttons/Button';
import { Ball } from '@sorare/core/src/atoms/icons/Ball';
import { Text16, Text18, Title4 } from '@sorare/core/src/atoms/typography';
import Back from '@sorare/core/src/components/card/Back';
import ScarcityCardIcon from '@sorare/core/src/components/card/ScarcityCardIcon';
import { ClaimReferralRewardDialog } from '@sorare/core/src/components/referral/ClaimReferralRewardDialog';
import { GalleryLink } from '@sorare/core/src/components/user/GalleryLink';
import { Nickname } from '@sorare/core/src/components/user/Nickname';
import TimeLeft from '@sorare/core/src/contexts/ticker/TimeLeft';
import useQuery from '@sorare/core/src/hooks/graphql/useQuery';
import { useReferralReward } from '@sorare/core/src/hooks/useReferralReward';
import useToggle from '@sorare/core/src/hooks/useToggle';
import { glossary } from '@sorare/core/src/lib/glossary';
import { isA } from '@sorare/core/src/lib/gql';
import { CARDS_REQUIREMENTS_BY_SPORT } from '@sorare/core/src/lib/referral';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import ReferralCampaignTitle from '@football/components/user/ReferralCampaignTitle';

import Progression from './Progression';
// import { ReferralBarQuery } from './__generated__/index.graphql';
import referralCampaignAnnouncementIcon from './referral-campaign.png';

type ReferralBarQuery = any;

type ReferralBarQuery_currentUser = NonNullable<
  ReferralBarQuery['currentUser']
>;

type ReferralBarQuery_config_referralCampaign = NonNullable<
  ReferralBarQuery['config']['referralCampaign']
>;

type ReferralBarQuery_currentUser_refereeReward = NonNullable<
  ReferralBarQuery_currentUser['refereeReward']
>;

type ReferralBarQuery_currentUser_referralAsReferee = NonNullable<
  ReferralBarQuery_currentUser['referralAsReferee']
>;

type ReferralBarQuery_currentUser_referralAsReferee_referrer =
  ReferralBarQuery_currentUser_referralAsReferee['referrer'];

type ReferralBarQuery_currentUser_referralAsReferee_referrer_User =
  ReferralBarQuery_currentUser_referralAsReferee_referrer & {
    __typename: 'User';
  };

// const REFERRAL_BAR_QUERY = gql`
//   query ReferralBarQuery {
//     currentUser {
//       slug
//       referee
//       refereeReward {
//         id
//         shippingState
//         ...ClaimReferralRewardDialog_referralReward
//         ...useReferralReward_referralReward
//       }
//       referralAsReferee {
//         id
//         aasmState
//         expirationDate
//         # footballCardsAuctionCount: refereeSportCardsBoughtFromPrimaryMarketCount(
//         #   sport: FOOTBALL
//         # )
//         # nbaCardsAuctionCount: refereeSportCardsBoughtFromPrimaryMarketCount(
//         #   sport: NBA
//         # )
//         # baseballCardsAuctionCount: refereeSportCardsBoughtFromPrimaryMarketCount(
//         #   sport: BASEBALL
//         # )
//         referrer {
//           ... on User {
//             slug
//             ...Nickname_publicUserInfoInterface
//           }
//           ... on UserSource {
//             id
//             name
//           }
//         }
//       }
//     }
//     config {
//       id
//       referralCampaign {
//         id
//         #...ReferralCampaignTitle_referralCampaign
//       }
//     }
//   }
//   ${ClaimReferralRewardDialog.fragments.referralReward}
//   #{useReferralReward.fragments.referralReward}
//   ${ReferralCampaignTitle.fragments.referralCampaign}
//   ${Nickname.fragments.user}
// `;

type OuterProps = {
  smallBorder?: boolean;
  context: 'gallery' | 'invite';
};

interface Props extends OuterProps {
  currentUser: ReferralBarQuery_currentUser;
  referralCampaign: ReferralBarQuery_config_referralCampaign | null;
}

interface ReferralCampaignAnnouncementProps {
  referralCampaign: ReferralBarQuery_config_referralCampaign;
  smallBorder?: boolean;
  context: 'gallery' | 'invite';
}

const messages = defineMessages({
  title: {
    id: 'ReferralBar.title',
    defaultMessage: 'Buy cards from auctions to get a Limited Card',
  },
  claimSoon: {
    id: 'ReferralBar.claimSoon',
    defaultMessage: 'Your Reward is on its way! It can take 1-3 days.',
  },
});

const Content = styled.div`
  display: flex;
  gap: var(--double-unit);
  align-items: center;
`;
const Title = styled(Title4)`
  flex: 1;
`;

const ReadyToClaimReferralRewardHeader = ({
  refereeReward,
}: {
  refereeReward: ReferralBarQuery_currentUser_refereeReward;
}) => {
  const [openClaimDialog, toggleOpenClaimDialog] = useToggle(false);

  return (
    <Content>
      <ScarcityCardIcon
        border
        width="28px"
        height="36px"
        scarcity={Rarity.limited}
      />
      <Title>
        <FormattedMessage
          id="ReferralBar.giftWaiting"
          defaultMessage="A gift is waiting for you {gift}"
          values={{ gift: '🎁' }}
        />
      </Title>
      <Button medium color="gray" onClick={toggleOpenClaimDialog}>
        <FormattedMessage {...glossary.claim} />
      </Button>
      <ClaimReferralRewardDialog
        referralReward={refereeReward}
        open={openClaimDialog}
        onClose={toggleOpenClaimDialog}
      />
    </Content>
  );
};

const Row = styled.div`
  display: flex;
  gap: var(--half-unit);
`;
const Header = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  @media ${tabletAndAbove} {
    flex-direction: row;
    text-align: left;
  }
`;
const Card = styled.div`
  width: 30px;
`;
const Referrer = styled(GalleryLink)`
  color: white;
  font-weight: 700;
`;

const InProgressReferralRewardHeader = ({
  referralAsReferee,
  campaignCardCount,
}: {
  referralAsReferee: ReferralBarQuery_currentUser_referralAsReferee;
  campaignCardCount?: number | null;
}) => {
  const { referrer } = referralAsReferee;
  const completed =
    referralAsReferee.footballCardsAuctionCount >=
      CARDS_REQUIREMENTS_BY_SPORT[Sport.NBA] ||
    referralAsReferee.nbaCardsAuctionCount >=
      CARDS_REQUIREMENTS_BY_SPORT[Sport.FOOTBALL];
  return (
    <>
      <Header>
        <Card>
          <Back rarity={Rarity.limited} shine={false} />
        </Card>
        <div>
          <Row>
            <Text18 bold>
              <FormattedMessage
                {...(completed ? messages.claimSoon : messages.title)}
              />
            </Text18>
            {!completed && (
              <>
                {' · '}
                <TimeLeft
                  time={parseISO(referralAsReferee.expirationDate)}
                  withExplicitTime
                />
              </>
            )}
          </Row>
          <Text16 color="var(--c-neutral-600)">
            {isA<ReferralBarQuery_currentUser_referralAsReferee_referrer_User>(
              'User',
              referrer
            ) ? (
              <FormattedMessage
                id="ReferralBar.referrer"
                defaultMessage="My referrer {nickname}"
                values={{
                  nickname: (
                    <Referrer user={referrer}>
                      <Nickname user={referrer} />
                    </Referrer>
                  ),
                }}
              />
            ) : (
              <FormattedMessage
                id="ReferralBar.affiliate"
                defaultMessage="Invited by an affiliate"
              />
            )}
          </Text16>
        </div>
      </Header>
      <Progression
        icon={<Ball />}
        max={campaignCardCount || CARDS_REQUIREMENTS_BY_SPORT[Sport.FOOTBALL]}
        count={referralAsReferee.footballCardsAuctionCount}
      />
      <Progression
        icon={<FontAwesomeIcon icon={faBasketball} />}
        max={CARDS_REQUIREMENTS_BY_SPORT[Sport.NBA]}
        count={referralAsReferee.nbaCardsAuctionCount}
      />
      <Progression
        icon={<FontAwesomeIcon icon={faBaseball} />}
        max={CARDS_REQUIREMENTS_BY_SPORT[Sport.BASEBALL]}
        count={referralAsReferee.baseballCardsAuctionCount}
      />
    </>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  color: white;
  background-color: var(--c-neutral-1000);
  border-radius: var(--unit);
  padding: var(--double-unit);
  .dark-theme & {
    background-color: var(--c-neutral-200);
  }
`;
const AnnouncementRoot = styled.div`
  display: flex;
  flex-wrap: wrap-reverse;
  align-items: center;
  justify-content: center;
`;
const AnnouncementIcon = styled.img`
  max-height: 150px;
`;

const ReferralCampaignAnnouncement = (
  props: ReferralCampaignAnnouncementProps
) => {
  const { referralCampaign, context, smallBorder } = props;
  return (
    <Root className={classNames({ smallBorder })}>
      <AnnouncementRoot>
        <ReferralCampaignTitle
          referralCampaign={referralCampaign}
          ctaProps={{ color: 'blue' }}
          context={context}
        />
        <AnnouncementIcon
          src={referralCampaignAnnouncementIcon}
          alt="Referral Event"
        />
      </AnnouncementRoot>
    </Root>
  );
};

export const ReferralBar = (props: Props) => {
  const { currentUser, referralCampaign, context } = props;
  const { referralAsReferee, refereeReward } = currentUser;
  const { claimed } = useReferralReward(refereeReward);
  if (
    !referralAsReferee ||
    referralAsReferee.aasmState === 'expired' ||
    claimed
  ) {
    if (!referralCampaign) return null;

    return (
      <ReferralCampaignAnnouncement
        {...props}
        referralCampaign={referralCampaign}
      />
    );
  }

  const campaignCardCount = referralCampaign?.cardsCount;

  const renderHeader = () => {
    if (!claimed && refereeReward) {
      return (
        <ReadyToClaimReferralRewardHeader refereeReward={refereeReward!} />
      );
    }
    return (
      <InProgressReferralRewardHeader
        campaignCardCount={campaignCardCount}
        referralAsReferee={referralAsReferee}
      />
    );
  };
  return (
    <Root>
      <div>{renderHeader()}</div>
      {referralCampaign && !refereeReward && (
        <ReferralCampaignTitle
          referralCampaign={referralCampaign}
          context={context}
        />
      )}
    </Root>
  );
};

export const ReferralBarExposed = ({ ...restProps }: OuterProps) => {
  // const { data, loading } = useQuery<ReferralBarQuery>(REFERRAL_BAR_QUERY);

  // if (!data?.currentUser || loading) return null;

  // const { currentUser } = data;

  // return (
  //   <ReferralBar
  //     currentUser={currentUser}
  //     referralCampaign={data.config.referralCampaign}
  //     {...restProps}
  //   />
  // );
  return <>ReferralBarExposed555</>
};

export default ReferralBarExposed;
