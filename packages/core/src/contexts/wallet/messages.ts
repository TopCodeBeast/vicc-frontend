import { defineMessages } from 'react-intl';

import { Dict } from '@sorare/wallet-shared';

export const messages = defineMessages<keyof Dict>({
  address: {
    id: 'walletApp.address',
    defaultMessage: 'Address',
  },
  approveBank: {
    id: 'walletApp.approveBank',
    defaultMessage:
      'Your approval is required to be able to trade Cards with other managers.',
  },
  approveMigrator: {
    id: 'walletApp.approveMigrator',
    defaultMessage:
      'Your approval is required to be able to trade Cards with other managers.',
  },
  availableAmountForDeposit: {
    id: 'walletApp.availableAmountForDeposit',
    defaultMessage: 'Available funds for deposit',
  },
  depositAvailableSoon: {
    id: 'walletApp.depositAvailableSoon',
    defaultMessage:
      'Your deposit will be available in your balance in a moment.',
  },
  insufficientFundsForDeposit: {
    id: 'walletApp.insufficientFundsForDeposit',
    defaultMessage: 'Insufficient funds to cover transaction fees',
  },
  cancel: {
    id: 'walletApp.cancel',
    defaultMessage: 'Cancel',
  },
  changePasswordTitle: {
    id: 'walletApp.changePasswordTitle',
    defaultMessage: 'Change password',
  },
  currentPassword: {
    id: 'walletApp.currentPassword',
    defaultMessage: 'Current password',
  },
  currentPasswordPlaceholder: {
    id: 'walletApp.currentPasswordPlaceholder',
    defaultMessage: 'Your current password',
  },
  depositAmount: {
    id: 'walletApp.depositAmount',
    defaultMessage: 'Deposit amount',
  },
  depositFundsSubmit: {
    id: 'walletApp.depositFundsSubmit',
    defaultMessage: 'Deposit',
  },
  edit: {
    id: 'walletApp.edit',
    defaultMessage: 'Edit',
  },
  email: {
    id: 'walletApp.email',
    defaultMessage: 'Email',
  },
  emailUnconfirmed: {
    id: 'walletApp.emailUnconfirmed',
    defaultMessage:
      'not confirmed, we have sent you a confirmation link by email',
  },
  emailUnconfirmedTitle: {
    id: 'walletApp.emailUnconfirmedTitle',
    defaultMessage: "You've not confirmed your account.",
  },
  emailUnconfirmedBody: {
    id: 'walletApp.emailUnconfirmedBody',
    defaultMessage:
      "We've re-sent the confirmation email. Please check your email to confirm your account.",
  },
  forgotPassword: {
    id: 'walletApp.forgotPassword',
    defaultMessage: 'Forgot password?',
  },
  forgotPasswordTitle: {
    id: 'walletApp.forgotPasswordTitle',
    defaultMessage: 'Forgotten password',
  },
  gasPrice: {
    id: 'walletApp.gasPrice',
    defaultMessage: 'Gas Price (Gwei)',
  },
  gasPricePlaceholder: {
    id: 'walletApp.gasPricePlaceholder',
    defaultMessage: '0',
  },
  invalidCredentials: {
    id: 'walletApp.invalidCredentials',
    defaultMessage: 'invalid credentials',
  },
  isInvalid: {
    id: 'walletApp.isInvalid',
    defaultMessage: 'is invalid',
  },
  loading: {
    id: 'walletApp.loading',
    defaultMessage: 'Loading',
  },
  nickname: {
    id: 'walletApp.nickname',
    defaultMessage: 'Username',
  },
  noFundsAvailable: {
    id: 'walletApp.noFundsAvailable',
    defaultMessage: 'No funds to deposit',
  },
  noWallet: {
    id: 'walletApp.noWallet',
    defaultMessage: "You don't have a wallet",
  },
  password: {
    id: 'walletApp.password',
    defaultMessage: 'Password',
  },
  recoverWallet: {
    id: 'walletApp.recoverWallet',
    defaultMessage: 'Your wallet must be recovered',
  },
  recoveryKey: {
    id: 'walletApp.recoveryKey',
    defaultMessage: 'Recovery key',
  },
  recoverKeyTitle: {
    id: 'walletApp.recoverKeyTitle',
    defaultMessage: 'Recover wallet',
  },
  resetPasswordTitle: {
    id: 'walletApp.resetPasswordTitle',
    defaultMessage: 'Reset password',
  },
  signEthMigration: {
    id: 'walletApp.signEthMigration',
    defaultMessage: 'Your signature is required to trade with other managers.',
  },
  signIn: {
    id: 'walletApp.signIn',
    defaultMessage: 'Sign in',
  },
  signInTitle: {
    id: 'walletApp.signInTitle',
    defaultMessage: 'Sign in to Sorare',
  },
  signMigration: {
    id: 'walletApp.signMigration',
    defaultMessage: 'Your signature is required to trade with other managers.',
  },
  signUp: {
    id: 'walletApp.signUp',
    defaultMessage: 'Sign up',
  },
  signUpAgreePartnersOffers: {
    id: 'walletApp.signUpAgreePartnersOffers',
    defaultMessage:
      "I want to receive email offers from Sorare's partnering clubs.",
  },
  signUpTerms: {
    id: 'walletApp.signUpTerms',
    defaultMessage:
      "I agree to Sorare's <t>Terms of Service</t> and <g>Game Rules</g>",
  },
  signUpTitle: {
    id: 'walletApp.signUpTitle',
    defaultMessage: 'Sign up to Sorare',
  },
  signUpSubtitle: {
    id: 'walletApp.signUpSubtitle',
    defaultMessage: 'Create your sorare account',
  },
  submit: {
    id: 'walletApp.submit',
    defaultMessage: 'Submit',
  },
  transactionCost: {
    id: 'walletApp.transactionCost',
    defaultMessage: 'Transaction cost',
  },
  twoFaCode: {
    id: 'walletApp.twoFaCode',
    defaultMessage: '2FA Code',
  },
  unlock: {
    id: 'walletApp.unlock',
    defaultMessage: 'Unlock',
  },
  unlockWalletPlaceholder: {
    id: 'walletApp.unlockWalletPlaceholder',
    defaultMessage: 'Enter your password',
  },
  walletLocked: {
    id: 'walletApp.walletLocked',
    defaultMessage: 'Wallet locked',
  },
  walletUnlocked: {
    id: 'walletApp.walletUnlocked',
    defaultMessage: 'Wallet unlocked',
  },
  close: {
    id: 'walletApp.close',
    defaultMessage: 'Close',
  },
  privateKey: {
    id: 'walletApp.privateKey',
    defaultMessage: 'Your private key',
  },
  privateKeyWarning: {
    id: 'walletApp.privateKeyWarning',
    defaultMessage:
      'Warning: Do not share your private keys, our support will never ask them. Anyone with your private key could steal all your ETH and Cards.',
  },
  pwned: {
    id: 'password.pwned',
    defaultMessage:
      'This password previously appeared in a public data breach on another website. Please choose a stronger password.',
  },
  levenshtein: {
    id: 'password.levenshtein',
    defaultMessage: 'too close to your email or username',
  },
  length: {
    id: 'password.length',
    defaultMessage: 'should be at least 6 characters long',
  },
  generateWallet: {
    id: 'walletApp.generateWallet',
    defaultMessage:
      'Please choose a password in order to protect your Sorare wallet.',
  },
  updateWallet: {
    id: 'walletApp.updateWallet',
    defaultMessage:
      'Your wallet needs to be updated, please enter your password.',
  },
  message: {
    id: 'walletApp.message',
    defaultMessage: 'Message',
  },
  signature: {
    id: 'walletApp.signature',
    defaultMessage: 'Signature',
  },
  ethereumPrivateKey: {
    id: 'walletApp.ethereumPrivateKey',
    defaultMessage: 'Ethereum private key',
  },
  ethereumPublicAddress: {
    id: 'walletApp.ethereumPublicAddress',
    defaultMessage: 'Ethereum public address',
  },
  ethereumKeysTitle: {
    id: 'walletApp.ethereumKeysTitle',
    defaultMessage: 'Ethereum',
  },
  ethereumKeysDescription: {
    id: 'walletApp.ethereumKeysDescription',
    defaultMessage:
      'This is your Ethereum Wallet. You can send ETH (and only ETH) to the public address.',
  },
  starkwarePrivateKey: {
    id: 'walletApp.starkwarePrivateKey',
    defaultMessage: 'Starkware private key',
  },
  starkwarePublicKey: {
    id: 'walletApp.starkwarePublicKey',
    defaultMessage: 'Starkware public key',
  },
  starkwareKeysTitle: {
    id: 'walletApp.starkwareKeysTitle',
    defaultMessage: 'Starkware',
  },
  starkwareKeysDescription: {
    id: 'walletApp.starkwareKeysDescription',
    defaultMessage:
      'This is your Sorare (Starkware) Wallet. This cannot receive ETH directly and is only used within Sorare.',
  },
  errorTrackingTitle: {
    id: 'walletApp.errorMessage.title',
    defaultMessage: 'Something wrong happened…',
  },
  errorTrackingBody: {
    id: 'walletApp.errorMessage.body',
    defaultMessage: 'We are investigating.',
  },
  newPassword: {
    id: 'walletApp.newPassword',
    defaultMessage: 'New password',
  },
  confirmNewPassword: {
    id: 'walletApp.confirmNewPassword',
    defaultMessage: 'Confirm new password',
  },
  differentPasswords: {
    id: 'walletApp.differentPasswords',
    defaultMessage: 'Passwords are different',
  },
  newPasswordPlaceholder: {
    id: 'walletApp.newPasswordPlaceholder',
    defaultMessage: 'Your new password',
  },
  changePasswordSubmit: {
    id: 'walletApp.changePasswordSubmit',
    defaultMessage: 'Change',
  },
  tooManyLoginAttempts: {
    id: 'walletApp.tooManyLoginAttempts',
    defaultMessage: 'Too many login attempts. Please try again later',
  },
  trustedPartners: {
    id: 'walletApp.trustedPartners',
    defaultMessage: 'Trusted Partners',
  },
  trustedPartnersDesc1: {
    id: 'walletApp.trustedPartnersDesc1',
    defaultMessage:
      'Sorare will only share information with trusted partners subject to your express consent.',
  },
  trustedPartnersDesc2: {
    id: 'walletApp.trustedPartnersDesc2',
    defaultMessage:
      'You will find the list of our trusted partners and more information on their practice below.',
  },
  trustedPartnersDesc3: {
    id: 'walletApp.trustedPartnersDesc3',
    defaultMessage:
      'You can consent or oppose to data sharing by checking / unchecking the boxes in front of each partner',
  },
  trustedPartnersHelper: {
    id: 'walletApp.trustedPartnersHelper',
    defaultMessage:
      'Once you have agreed to the sharing of your information with a specific partner, you can still withdraw your consent to the processing of your data by a specific partner at any time. In order to do so, please contact them directly by referring to their privacy policy listed above.',
  },
  passwordIsInvalid: {
    id: 'walletApp.passwordIsInvalid',
    defaultMessage: 'Password is invalid',
  },
  next: {
    id: 'walletApp.next',
    defaultMessage: 'Next',
  },
  orQuickAccess: {
    id: 'walletApp.quickAccess',
    defaultMessage: 'Or quick access',
  },
  'passwordForgotten?': {
    id: 'walletApp.passwordForgotten?',
    defaultMessage: 'Forgot password?',
  },
  optional: {
    id: 'walletApp.optional',
    defaultMessage: 'Optional',
  },
  required: {
    id: 'walletApp.required',
    defaultMessage: 'Required',
  },
  iAgreeToShare: {
    id: 'walletApp.iAgreeToShare',
    defaultMessage:
      "I agree to share my information with Sorare's trusted partners for marketing and promotional purposes",
  },
  iAgreeToShareV2: {
    id: 'walletApp.iAgreeToShareV2',
    defaultMessage:
      "I agree to share my information with Sorare's trusted partners listed <partnerslist>here</partnerslist> for marketing and promotional purposes",
  },
  privacyPolicy: {
    id: 'walletApp.privacyPolicy',
    defaultMessage: 'Privacy Policy',
  },
  alreadyHaveAccount: {
    id: 'walletApp.alreadyHaveAccount',
    defaultMessage: 'Have an account?',
  },
  dontHaveAccount: {
    id: 'walletApp.dontHaveAccount',
    defaultMessage: "Don't have an account?",
  },
  iAgreeToTermsAndConditions: {
    id: 'walletApp.iAgreeToTermsAndConditions',
    defaultMessage: `I agree to Sorare's <terms>Terms and Conditions</terms> and that my personal data will be processed pursuant to the <privacy>Privacy Policy</privacy>.`,
  },
  youMustAcceptTermsAndConditions: {
    id: 'walletApp.youMustAcceptTermsAndConditions',
    defaultMessage:
      'You must accept our Terms and Conditions and Privacy Policy',
  },
  iAgreeToAgeLimit: {
    id: 'walletApp.iAgreeToAgeLimit',
    defaultMessage: 'I certify that I am 18 years old or older.',
  },
  youMustAcceptAgeLimit: {
    id: 'walletApp.youMustAcceptAgeLimit',
    defaultMessage: 'You must be 18 years old or older',
  },
  navigationBack: {
    id: 'walletApp.navigationBack',
    defaultMessage: 'Back',
  },
  forgotPasswordHelper: {
    id: 'walletApp.forgotPasswordHelper',
    defaultMessage:
      'Enter the email address associated with your Sorare account.',
  },
  // Partners Optin
  epl: {
    id: 'walletApp.partners.epl',
    defaultMessage: 'Premier League',
  },
  eredivisie: {
    id: 'walletApp.partners.eredivisie',
    defaultMessage: 'Eredivisie',
  },
  laliga: {
    id: 'walletApp.partners.laliga',
    defaultMessage: 'LaLiga Santander',
  },
  nba: {
    id: 'walletApp.partners.nba',
    defaultMessage: 'NBA - National Basketball Association',
  },
  nbpa: {
    id: 'walletApp.partners.nbpa',
    defaultMessage: 'NBPA - National Basketball Players Association',
  },
  mlb: {
    id: 'walletApp.partners.mlb',
    defaultMessage: 'MLB - Major League Baseball',
  },
  mlbpa: {
    id: 'walletApp.partners.mlbpa',
    defaultMessage: 'MLBPA - Major League Baseball Players Association',
  },
  eplPolicyUrl: {
    id: 'walletApp.partners.eplPolicyUrl',
    defaultMessage: 'https://www.premierleague.com/privacy-policy',
  },
  eredivisiePolicyUrl: {
    id: 'walletApp.partners.eredivisiePolicyUrl',
    defaultMessage: 'https://eredivisie.eu/privacy-statement',
  },
  laligaPolicyUrl: {
    id: 'walletApp.partners.laligaPolicyUrl',
    defaultMessage: 'https://www.laliga.com/en-GB/legal/politica-privacidad',
  },
  nbaPolicyUrl: {
    id: 'walletApp.partners.nbaPolicyUrl',
    defaultMessage: 'https://www.nba.com/privacy-policy',
  },
  nbpaPolicyUrl: {
    id: 'walletApp.partners.nbpaPolicyUrl',
    defaultMessage: 'https://nbpa.com/privacypolicy',
  },
  mlbPolicyUrl: {
    id: 'walletApp.partners.mlbPolicyUrl',
    defaultMessage: 'https://www.mlb.com/official-information/privacy-policy',
  },
  mlbpaPolicyUrl: {
    id: 'walletApp.partners.mlbpaPolicyUrl',
    defaultMessage: 'http://mlb.mlb.com/pa/info/privacy.jsp',
  },
});
