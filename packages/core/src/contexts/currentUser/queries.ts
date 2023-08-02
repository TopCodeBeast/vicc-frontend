import { TypedDocumentNode, gql } from '@apollo/client';

import PostalAddressForm from '@core/components/settings/PostalAddressForm';
import ActiveUserAvatar from '@core/components/user/ActiveUserAvatar';
import { useConversionCredit } from '@core/hooks/useConversionCredit';
import { monetaryAmountFragment } from '@core/lib/monetaryAmount';

import {
  CurrentUseProvider_ethereumAccounts,
  CurrentUseProvider_fiatAccounts,
  CurrentUseProvider_sportProfile,
  CurrentUserProvider_conversionCredit,
  CurrentUserProvider_currentUser,
  CurrentUserProvider_onboardingStatus,
  CurrentUserProvider_walletRecovery,
  CurrentUserQuery,
  CurrentUserQueryVariables,
  SignInMutation,
  SignInMutationVariables,
  onCurrentUserWasUpdated,
  onCurrentUserWasUpdatedVariables,
  onDeviceWasUpdated,
  onDeviceWasUpdatedVariables,
} from './__generated__/queries.graphql';

export const onboardingStatus = gql`
  fragment CurrentUserProvider_onboardingStatus on CurrentUser {
    slug
    onboardingStatus {
      id
      enabled
      completed
    }
  }
` as TypedDocumentNode<CurrentUserProvider_onboardingStatus>;

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
` as TypedDocumentNode<CurrentUseProvider_sportProfile>;

export const conversionCredit = gql`
  fragment CurrentUserProvider_conversionCredit on CurrentUser {
    slug
    ...useConversionCredit_currentUser
  }
  ${useConversionCredit.fragments.currentUser}
` as TypedDocumentNode<CurrentUserProvider_conversionCredit>;

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
` as TypedDocumentNode<CurrentUserProvider_walletRecovery>;

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
` as TypedDocumentNode<CurrentUseProvider_ethereumAccounts>;
export const fiatAccounts = gql`
  fragment CurrentUseProvider_fiatAccounts on CurrentUser {
    slug
    accounts {
      id
      accountable {
        ... on FiatWalletAccount {
          id
          state
          firstName
          lastName
          nationalityCode
          dob
          countryOfResidenceCode
          availableBalance
          currency
          totalBalance
          kycStatus
          kycRefusedReason
          depositBankAccount {
            ... on IbanBankAccount {
              bic
              iban
            }
          }
        }
      }
    }
  }
` as TypedDocumentNode<CurrentUseProvider_fiatAccounts>;

export const currentUser = gql`
  fragment CurrentUserProvider_currentUser on CurrentUser {
    id
    slug
    suspended
    createdAt
    email
    nickname
    active
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
      rewardCurrency
      ...PostalAddressForm_userSettings
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
    connectedOauths {
      id
      email
      provider
    }
    noCardRouteEnabled
    so5NoCardRouteOpened
    blockchainCardsInLineups
    ...CurrentUserProvider_conversionCredit
    ...CurrentUserProvider_onboardingStatus
    ...CurrentUseProvider_sportProfile
    ...CurrentUserProvider_walletRecovery
    ...CurrentUseProvider_ethereumAccounts
    ...CurrentUseProvider_fiatAccounts
    ...ActiveUserAvatar_user
  }
  ${walletRecovery}
  ${conversionCredit}
  ${onboardingStatus}
  ${sportProfile}
  ${ethereumAccounts}
  ${fiatAccounts}
  ${ActiveUserAvatar.fragments.user}
  ${PostalAddressForm.fragments.userSettings}
` as TypedDocumentNode<CurrentUserProvider_currentUser>;

export const CURRENT_USER_QUERY = gql`
  query CurrentUserQuery {
    currentUser {
      slug
      ...CurrentUserProvider_currentUser
    }
  }
  ${currentUser}
` as TypedDocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;

export const onDeviceSubscription = gql`
  subscription onDeviceWasUpdated {
    deviceWasUpdated {
      id
      eventType
    }
  }
` as TypedDocumentNode<onDeviceWasUpdated, onDeviceWasUpdatedVariables>;

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
        id
        date
        providerType
        transactionHash
        amounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
      }
      myRecentActiveBids {
        id
        maximumAmounts {
          ...MonetaryAmountFragment_monetaryAmount
        }
        auction {
          id
          privateCurrentPrice
          privateMinNextBid
          currency
        }
      }
      referralAsReferee {
        id
        aasmState
        footballCardsAuctionCount: refereeSportCardsBoughtFromPrimaryMarketCount(
          sport: FOOTBALL
        )
        nbaCardsAuctionCount: refereeSportCardsBoughtFromPrimaryMarketCount(
          sport: NBA
        )
        baseballCardsAuctionCount: refereeSportCardsBoughtFromPrimaryMarketCount(
          sport: BASEBALL
        )
      }
      ...CurrentUserProvider_onboardingStatus
      ...CurrentUserProvider_conversionCredit
      ...CurrentUseProvider_fiatAccounts
    }
  }
  ${monetaryAmountFragment}
  ${onboardingStatus}
  ${conversionCredit}
  ${fiatAccounts}
` as TypedDocumentNode<
  onCurrentUserWasUpdated,
  onCurrentUserWasUpdatedVariables
>;

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
` as TypedDocumentNode<SignInMutation, SignInMutationVariables>;
