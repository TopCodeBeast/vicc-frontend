import { gql } from '@apollo/client';

import ActiveUserAvatar from '@core/components/user/ActiveUserAvatar';
import { useConversionCredit } from '@core/hooks/useConversionCredit';

export const onboardingStatus = gql`
  fragment CurrentUserProvider_onboardingStatus on CurrentUser {
    slug
    onboardingStatus {
      id
      enabled
      completed
    }
  }
`;

// const sportProfile = gql`
//   fragment CurrentUseProvider_sportProfile on CurrentUser {
//     slug
//     footballProfile {
//       id
//       onboarded
//     }
//     baseballProfile {
//       id
//       onboarded
//     }
//     nbaProfile {
//       id
//       onboarded
//     }
//   }
// `;

// export const conversionCredit = gql`
//   fragment CurrentUserProvider_conversionCredit on CurrentUser {
//     slug
//     ...useConversionCredit_currentUser
//   }
//   ${useConversionCredit.fragments.currentUser}
// `;

export const walletRecovery = gql`
  fragment CurrentUserProvider_walletRecovery on CurrentUser {
    slug
    wallet {
      ethereumAddress
      # status
      # holdsValue
      # recoveryOptions {
      #   id
      #   destination
      #   method
      #   status
      # }
    }
  }
`;

// export const ethereumAccounts = gql`
//   fragment CurrentUseProvider_ethereumAccounts on CurrentUser {
//     slug
//     accounts {
//       id
//       sorareManaged
//       accountable {
//         ... on EthereumAccount {
//           address
//         }
//       }
//     }
//   }
// `;
// export const fiatAccounts = gql`
//   fragment CurrentUseProvider_fiatAccounts on CurrentUser {
//     slug
//     accounts {
//       id
//       accountable {
//         ... on FiatWalletAccount {
//           id
//           status
//           availableBalance
//           currency
//           totalBalance
//         }
//       }
//     }
//   }
// `;

export const currentUser = gql`
  fragment CurrentUserProvider_currentUser on CurrentUser {
    id
    slug
    suspended
    createdAt
    email
    nickname
    # active
    fromPath
    blockedUntil
    # confirmedDevice
    referrer {
      slug
      suspended
      nickname
      createdAt
      profile {
        id
        verified
      }
      ...ActiveUserAvatar_user
    }
    referee
    referralRewardsCount
    referralAsReferee {
      id
    }
    referrals {
      totalCount
    }
    footballReferralsCompleted: referrals(sport: CRICKET, state: COMPLETED) {
      totalCount
    }
    #nbaReferralsCompleted: referrals(sport: NBA, state: COMPLETED) {
    #  totalCount
    #}
    #baseballReferralsCompleted: referrals(sport: BASEBALL, state: COMPLETED) {
    #  totalCount
    #}
    referralUrl
    sorarePrivateKey: viccPrivateKey {
      iv
      salt
      encryptedPrivateKey
    }
    sorarePrivateKeyRecovery: viccPrivateKeyRecovery
    sorareAddress: viccAddress
    starkKey
    bankMappedEthereumAddress
    depositedEth
    # currentDevice {
    #   id
    # }
    # devices {
    #   deviceType
    #   id
    #   os
    #   userAgent
    #   lastUsedAt
    # }
    coinBalance
    availableBalance
    availableBalanceForWithdrawal
    totalBalance
    bankBalance
    # ethMigration {
    #   id
    #   aasmState
    # }
    otpRequiredForLogin
    cardCounts {
      total
      limited
      rare
      superRare
      unique
    }
    # featureFlagCustomAttributes
    phoneNumber
    phoneNumberVerificationRequested
    phoneNumberVerified
    confirmed
    profile {
      id
      verified
      clubName
      clubShield {
        id
        pictureUrl
      }
      status
      discordUsername
      twitterUsername
      # enabledWallets
    }
    unverifiedPhoneNumber
    userSettings {
      id
      disableAllEmails
      locale
      currency
      fiatCurrency
      lifecycle
      hideBalance
      hideCommonCards
      tcuStatus
    }
    unclaimedActionRewards {
      id
    }
    unclaimedSo5Rewards: unclaimedVicc5Rewards {
      slug
      coinAmount
      so5Fixture: vicc5Fixture {
        slug
        endDate
      }
    }
    unclaimedReferralRewardsCount
    unreadNotificationsCount
    pendingDirectWithdrawalCount
    # rampSupported
    apiKey
    mustAcceptTcus
    followingCount
    followersCount
    # pendingDeposits {
    #   id
    #   date
    #   providerType
    #   amount
    #   transactionHash
    #   amountInFiat {
    #     eur
    #     gbp
    #     usd
    #   }
    # }
    connectedOauths: connectedOAuths {
      id
      email
      provider
    }
    # noCardRouteEnabled
    # so5NoCardRouteOpened
    # blockchainCardsInLineups
    #...CurrentUserProvider_conversionCredit
    ...CurrentUserProvider_onboardingStatus
    #...CurrentUseProvider_sportProfile
    #...CurrentUserProvider_walletRecovery
    #...CurrentUseProvider_ethereumAccounts
    #...CurrentUseProvider_fiatAccounts
    ...ActiveUserAvatar_user
  }
  #{walletRecovery}
  #{conversionCredit}
  ${onboardingStatus}
  #{sportProfile}
  #{ethereumAccounts}
  #{fiatAccounts}
  ${ActiveUserAvatar.fragments.user}
`;

export const CURRENT_USER_QUERY = gql`
  query CurrentUserQuery {
    currentUser {
      slug
      ...CurrentUserProvider_currentUser
    }
  }
  ${currentUser}
`;

// export const onDeviceSubscription = gql`
//   subscription onDeviceWasUpdated {
//     deviceWasUpdated {
//       id
//       eventType
//     }
//   }
// `;

// export const subscription = gql`
//   subscription onCurrentUserWasUpdated {
//     currentUserWasUpdated {
//       slug
//       bankMappedEthereumAddress
//       availableBalance
//       availableBalanceForWithdrawal
//       bankBalance
//       coinBalance
//       unreadNotificationsCount
//       ethMigration {
//         id
//         aasmState
//       }
//       pendingDeposits {
//         id
//         date
//         amount
//         providerType
//         transactionHash
//         amountInFiat {
//           eur
//           usd
//           gbp
//         }
//       }
//       myRecentActiveBids {
//         id
//         maximumAmount
//         auction {
//           id
//           privateCurrentPrice
//           privateMinNextBid
//           currency
//         }
//       }
//       ...CurrentUserProvider_onboardingStatus
//       ...CurrentUserProvider_conversionCredit
//       ...CurrentUseProvider_fiatAccounts
//     }
//   }
//   ${onboardingStatus}
//   ${conversionCredit}
//   ${fiatAccounts}
// `;

export const SIGN_IN_MUTATION = gql`
  mutation SignInMutation($input: signInInput!) {
    signIn(input: $input) {
      currentUser {
        slug
        timeLeftForConfirmation
        ...CurrentUserProvider_currentUser
      }
      otpSessionChallenge
      errors {
        path
        message
        code
      }
      tcuToken
    }
  }
  ${currentUser}
`;
