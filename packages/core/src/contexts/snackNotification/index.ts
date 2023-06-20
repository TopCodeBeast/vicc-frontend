import { SnackbarOrigin } from '@material-ui/core';
import { createContext, useContext } from 'react';
import { defineMessages } from 'react-intl';

export const notifications = defineMessages({
  approvalForBankSent: {
    id: 'ApprovalForBankSent.notification',
    defaultMessage:
      'Your account is now being registered with the exchange contract. Once done you can finalise the deal.',
  },
  approvalForBankPending: {
    id: 'ApprovalForBankPending.notification',
    defaultMessage:
      'We have just signed your account to the marketplace to list Cards. You will be able to list your Cards in a few hours tops. You can track the status here ->',
  },
  bridgeApproval: {
    id: 'BridgeApproval.notification',
    defaultMessage:
      "We're authorizing deposits to the bridge contract. Please wait for this transaction to complete before doing a deposit",
  },
  bidField: {
    id: 'BidField.notificationSuccess',
    defaultMessage: 'You have just bid {amount} on {auction}',
  },
  cancelOffer: {
    id: 'CancelOffer.notification',
    defaultMessage: 'Sale has been canceled',
  },
  cancelAuction: {
    id: 'CancelAuction.notification',
    defaultMessage: 'Auction has been canceled',
  },
  cardDropPickerError: {
    id: 'CardDropPicker.errorNotification',
    defaultMessage: 'Unable to proceed. Please contact Sorare.',
  },
  cardDropPickerTooLong: {
    id: 'CardDropPicker.tooLongNotification',
    defaultMessage:
      'The Card transfer is taking longer than expected. Refresh your browser in a few minutes to see your Cards.',
  },
  confirmWithdrawal: {
    id: 'WithdrawEthBeta',
    defaultMessage:
      'Please confirm your withdrawal through the confirmation email that has been sent to you.',
  },
  ethereumCard: {
    id: 'EthereumCard.notification',
    defaultMessage:
      'Your Card has been deposited. It might take a few minutes to appear in your gallery.',
  },
  ethereumAccountLinked: {
    id: 'AddEthereumAccountForm.notification',
    defaultMessage: 'Your Ethereum account {address} has been linked',
  },
  withdrawEthForm: {
    id: 'WithdrawEthForm.successNotification',
    defaultMessage: 'ETH has been withdrawn',
  },
  newSaleDialog: {
    id: 'NewSaleDialog.notification',
    defaultMessage: 'Your Card is on sale!',
  },
  composeLineup: {
    id: 'ComposeLineup.successNotification',
    defaultMessage: 'Your team has been saved!',
  },
  errors: {
    id: 'Notification.errors',
    defaultMessage: 'Errors: {errors}',
  },
  baseballErrors: {
    id: 'ComposeBaseballLineup.errors',
    defaultMessage:
      'This competition requires <reqs></reqs> Please add those Cards to enter or visit the <link>Marketplace</link> to acquire the Cards you need.',
  },
  baseballDraftMoreThanFiveOnTheSameTeam: {
    id: 'Baseball.Draft.TooManyOnSameTeam.DescriptionLong',
    defaultMessage:
      'You have {nbDrafted} players from the {teamName}. You have to swap out one player to meet the criteria of maximum {max} players per team.',
  },
  exploreMarketplaceSuccess: {
    id: 'Onboarding.exploreMarketplaceSuccess',
    defaultMessage:
      '<notification><success>Task successfully completed!</success>Learn: How to recruit new players</notification>',
  },
  baseballDraftAutofillErrorExceedBudget: {
    id: 'Baseball.Draft.AutofillError.ExceedBudget',
    defaultMessage:
      'You do not have enough budget remaining to auto complete a team',
  },
  baseballTeamRegistered: {
    id: 'ComposeBaseballLineup.teamRegistered',
    defaultMessage: 'Team registered successfully',
  },
  baseballDraftCompleted: {
    id: 'BaseballOnboarding.Draft.completed',
    defaultMessage: 'Draft completed',
  },
  invalidAddress: {
    id: 'Notification.invalidAddress',
    defaultMessage: 'Invalid address',
  },
  internalError: {
    id: 'Notification.internalError',
    defaultMessage: 'Internal error: {error}',
  },
  serviceUnderMaintenance: {
    id: 'Notification.serviceUnderMaintenance',
    defaultMessage:
      'Maintenance operation in progress from {start} to {end}: {msg}',
  },
  withdrawCard: {
    id: 'WithdrawCard.successNotification',
    defaultMessage: 'Your Card has been withdrawn',
  },
  acceptInvitation: {
    id: 'AcceptInvitation.successNotification',
    defaultMessage: 'Welcome to Sorare!',
  },
  passwordForgottenError: {
    id: 'PasswordForgotten.errorNotification',
    defaultMessage: 'An error has occured. Please try again later.',
  },
  passwordForgottenSuccess: {
    id: 'PasswordForgotten.successNotification',
    defaultMessage: 'Please check your email to reset your password.',
  },
  changePassword: {
    id: 'ChangePassword.successNotification',
    defaultMessage: 'Password updated successfully',
  },
  profile: {
    id: 'Profile.updateEmailSuccessNotification',
    defaultMessage: 'Please confirm your new email on {email}.',
  },
  confirmDeviceRequestSent: {
    id: 'Wallet.confirmDeviceRequestSent',
    defaultMessage:
      'Please check your {delivery, select, email {email} phone {phone} other {email or phone}} to confirm the current device.',
  },
  signUp: {
    id: 'Signup.successNotifications',
    defaultMessage:
      'Welcome {nickname}! Please check your emails to confirm your account',
  },
  directOfferCancelled: {
    id: 'DirectOffer.cancelNotification',
    defaultMessage: 'Offer cancelled',
  },
  directOfferAccepted: {
    id: 'DirectOffer.acceptedNotification',
    defaultMessage: 'Offer accepted',
  },
  directOfferRejected: {
    id: 'DirectOffer.rejectedNotification',
    defaultMessage: 'Offer rejected',
  },
  offerBuilder: {
    id: 'OfferBuilder.successNotification',
    defaultMessage: 'Offer has been sent to {nickname}',
  },
  so5FixtureDelete: {
    id: 'So5Fixture.deleteNotification',
    defaultMessage: 'Your team has been deleted!',
  },
  so5LineupsConfirm: {
    id: 'So5Fixture.confirmLineupsNotification',
    defaultMessage: 'Your teams have been confirmed',
  },
  so5LineupsDelete: {
    id: 'So5Fixture.deleteLineupsNotification',
    defaultMessage: 'Your teams have been deleted!',
  },
  so5RemovedUserFromGroup: {
    id: 'So5UserGroup.RemovedNotification',
    defaultMessage: 'You removed {user} from {group} League!',
  },
  so5RemovedSelfFromGroup: {
    id: 'So5UserGroup.RemovedSelfNotification',
    defaultMessage: "You left {group}'s League!",
  },
  so5UserGroupDeleted: {
    id: 'So5UserGroup.Deleted',
    defaultMessage: 'Your League has been deleted!',
  },
  so5UserGroupUpdated: {
    id: 'So5UserGroup.Updated',
    defaultMessage: 'Your League has been updated!',
  },
  buyFieldCard: {
    id: 'BuyField.successNotificationCard',
    defaultMessage: 'You have just bought {card}!',
  },
  buyFieldPack: {
    id: 'BuyField.successNotificationPack',
    defaultMessage: 'You have just bought a starter pack!',
  },
  offerSent: {
    id: 'Offer.successNotification',
    defaultMessage: 'Your offer has been sent',
  },
  share: {
    id: 'Share.cardShared',
    defaultMessage: 'The Card page has been copied to your clipboard',
  },
  '2faEnabled': {
    id: 'Update2FA.2faEnabled',
    defaultMessage:
      'Two-factor authentication has been successfully enabled on your account',
  },
  '2faDisabled': {
    id: 'Update2FA.2faDisabled',
    defaultMessage:
      'Two-factor authentication has been successfully disabled on your account',
  },
  walletRecovered: {
    id: 'Wallet.recovered',
    defaultMessage: 'Your wallet has been successfully recovered',
  },
  unlockWallet: {
    id: 'Wallet.unlockWallet',
    defaultMessage: 'Please unlock your wallet to be able to proceed',
  },
  txSent: {
    id: 'Tx.sent',
    defaultMessage: 'Transaction has been sent successfully',
  },
  txNotSent: {
    id: 'Tx.notSent',
    defaultMessage: 'Unable to send transaction',
  },
  phoneNumberVerified: {
    id: 'VerifyPhoneNumber.verified',
    defaultMessage: 'Your phone number has been successfully verified!',
  },
  referralMailInvitationSent: {
    id: 'InviteFriendsCta.mailSent',
    defaultMessage: 'Your invitation has been successfully sent to {email}!',
  },
  paymentMethodDetached: {
    id: 'PaymentMethod.detached',
    defaultMessage: 'Your credit card has been removed',
  },
  secondFactorRecommendation: {
    id: 'CurrentUser.secondFactorRecommendation',
    defaultMessage:
      'To ensure the security of your assets on Sorare, we strongly recommend that you <link>enable a second authentication factor</link>.',
  },
  confirmEmail: {
    id: 'CurrentUser.confirmEmail.remainingHours',
    defaultMessage:
      '<strong>You still need to confirm your email.</strong> Check your email to confirm your account {remainingHours, plural, =0 {within the coming minutes} one {within the hour} other {within the next # hours}} to avoid getting locked out.<link>Resend confirmation email</link>',
  },
  unknownReferrer: {
    id: 'OwnYourGame.unknownReferrer',
    defaultMessage:
      "The username <strong>{referrer}</strong> doesn't exist. Please try another referral link.",
  },
  nullSorarePrivateKeyRecovery: {
    id: 'CurrentUser.nullSorarePrivateKeyRecovery',
    defaultMessage:
      'Your wallet is not pending recovery. If you recently changed your password you will receive a new email within 24 hours.',
  },
  stripeAccountVerificationSumitted: {
    id: 'Notification.stripeAccountVerificationSumitted',
    defaultMessage:
      'Thank you for submitting your document. You will be notified once the review is processed.',
  },
  successfullySignedUp: {
    id: 'Snack.GameAvailable.subscribed',
    defaultMessage: 'You have successfully signed up!',
  },
  receiptPaymentSent: {
    id: 'Snack.RequestReceipt.success',
    defaultMessage: 'A receipt has been sent to your email address',
  },
  termsAccepted: {
    id: 'CurrentUser.termsAccepted',
    defaultMessage: 'You have accepted the terms of service, please sign in',
  },
  logOutAllDevices: {
    id: 'Snack.logOutAllDevices.success',
    defaultMessage:
      'You’ve been successfully logged out from all other devices besides this one',
  },
  accountingExtractSent: {
    id: 'MySorare.TransactionsHistory.accountingExtractSent',
    defaultMessage:
      'You should receive an email with your accounting extract within the coming minutes.',
  },
  recoveryEmailRegistered: {
    id: 'Settings.security.activateRecoveryEmail',
    defaultMessage:
      '{email} has been successfully added to your recovery methods.',
  },
  walletSuccessfullyRecovered: {
    id: 'Snack.walletSuccessfullyRecovered',
    defaultMessage: 'You’ve recovered your wallet.',
  },
});

export enum Level {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export type SnackNotificationOptions = {
  link?: string;
  internalLink?: string;
  level?: Level;
  autoHideDuration?: null | number;
  onClosed?: () => void;
  anchorOrigin?: SnackbarOrigin;
};

export interface SnackNotificationContext {
  showNotification: (
    id: keyof typeof notifications,
    values?: any,
    opts?: SnackNotificationOptions
  ) => void;
}

export const snackNotificationContext =
  createContext<SnackNotificationContext | null>(null);

export const useSnackNotificationContext = () =>
  useContext(snackNotificationContext)!;

export default snackNotificationContext.Provider;
