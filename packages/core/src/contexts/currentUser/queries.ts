import { gql } from '@apollo/client';

import { useConversionCredit } from '@sorare/core/src/hooks/useConversionCredit';

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

const sportProfile = gql`
  fragment CurrentUseProvider_sportProfile on CurrentUser {
    slug
    footballProfile {
      id
      onboarded
    }
    baseballProfile {
      id
      onboarded
    }
    nbaProfile {
      id
      onboarded
    }
  }
`;

const activityReports = gql`
  fragment CurrentUserProvider_activityReports on CurrentUser {
    slug
    footballLast30DaysLineupsCount
  }
`;

export const conversionCredit = gql`
  fragment CurrentUserProvider_conversionCredit on CurrentUser {
    slug
    ...useConversionCredit_currentUser
  }
  ${useConversionCredit.fragments.currentUser}
`;

export const walletRecovery = gql`
  fragment CurrentUserProvider_walletRecovery on CurrentUser {
    slug
    wallet {
      ethereumAddress
      status
      holdsValue
      recoveryOptions {
        id
        destination
        method
        status
      }
    }
  }
`;

export const ethereumAccounts = gql`
  fragment CurrentUseProvider_ethereumAccounts on CurrentUser {
    slug
    accounts {
      id
      sorareManaged
      accountable {
        ... on EthereumAccount {
          address
        }
      }
    }
  }
`;
export const fiatAccounts = gql`
  fragment CurrentUseProvider_fiatAccounts on CurrentUser {
    slug
    accounts {
      id
      accountable {
        ... on FiatWalletAccount {
          id
          availableBalance
          currency
          totalBalance
        }
      }
    }
  }
`;

export const currentUser = gql`
  fragment CurrentUserProvider_currentUser on CurrentUser {
    id
    slug
    suspended
    createdAt
    email
    nickname
    fromPath
    blockedUntil
    confirmedDevice
    referrer {
      slug
      suspended
      nickname
      createdAt
      profile {
        id
        pictureUrl
        verified
      }
    }
    referee
    referralRewardsCount
    referralAsReferee {
      id
    }
    referrals {
      totalCount
    }
    footballReferralsCompleted: referrals(sport: FOOTBALL, state: COMPLETED) {
      totalCount
    }
    nbaReferralsCompleted: referrals(sport: NBA, state: COMPLETED) {
      totalCount
    }
    baseballReferralsCompleted: referrals(sport: BASEBALL, state: COMPLETED) {
      totalCount
    }
    referralUrl
    sorarePrivateKey {
      iv
      salt
      encryptedPrivateKey
    }
    sorarePrivateKeyRecovery
    sorareAddress
    starkKey
    bankMappedEthereumAddress
    depositedEth
    currentDevice {
      id
    }
    devices {
      deviceType
      id
      os
      userAgent
    }
    coinBalance
    availableBalance
    availableBalanceForWithdrawal
    totalBalance
    bankBalance
    ethMigration {
      id
      aasmState
    }
    otpRequiredForLogin
    cardCounts {
      total
      limited
      rare
      superRare
      unique
    }
    featureFlagCustomAttributes
    phoneNumber
    phoneNumberVerificationRequested
    phoneNumberVerified
    confirmed
    profile {
      id
      pictureUrl
      verified
      clubName
      clubShield {
        id
        pictureUrl
      }
      status
      discordUsername
      twitterUsername
      enabledWallets
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
    unclaimedSo5Rewards {
      slug
      coinAmount
      so5Fixture {
        slug
        endDate
      }
    }
    unclaimedReferralRewardsCount
    unreadNotificationsCount
    pendingDirectWithdrawalCount
    rampSupported
    apiKey
    mustAcceptTcus
    followingCount
    followersCount
    pendingDeposits {
      date
      amount
      amountInFiat {
        eur
        gbp
        usd
      }
    }
    connectedOauths {
      id
      email
      provider
    }
    noCardRouteEnabled
    so5NoCardRouteOpened
    blockchainCardsInLineups
    ...CurrentUserProvider_activityReports
    ...CurrentUserProvider_conversionCredit
    ...CurrentUserProvider_onboardingStatus
    ...CurrentUseProvider_sportProfile
    ...CurrentUserProvider_walletRecovery
    ...CurrentUseProvider_ethereumAccounts
    ...CurrentUseProvider_fiatAccounts
  }
  ${walletRecovery}
  ${conversionCredit}
  ${activityReports}
  ${onboardingStatus}
  ${sportProfile}
  ${ethereumAccounts}
  ${fiatAccounts}
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

export const subscription = gql`
  subscription onCurrentUserWasUpdated {
    currentUserWasUpdated {
      slug
      bankMappedEthereumAddress
      availableBalance
      availableBalanceForWithdrawal
      bankBalance
      coinBalance
      unreadNotificationsCount
      ethMigration {
        id
        aasmState
      }
      pendingDeposits {
        date
        amount
        amountInFiat {
          eur
          usd
          gbp
        }
      }
      myRecentActiveBids {
        id
        maximumAmount
        auction {
          id
          privateCurrentPrice
          privateMinNextBid
        }
      }
      ...CurrentUserProvider_onboardingStatus
      ...CurrentUserProvider_conversionCredit
      ...CurrentUseProvider_fiatAccounts
    }
  }
  ${onboardingStatus}
  ${conversionCredit}
  ${fiatAccounts}
`;

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
