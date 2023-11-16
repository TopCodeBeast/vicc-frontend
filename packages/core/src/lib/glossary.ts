import { defineMessages } from 'react-intl';

import { Sport } from '__generated__/globalTypes';
import { AlgoliaCardIndexesName } from '@core/contexts/config';

export const CAPTAIN = 'C';

export const glossary = defineMessages({
  unlock: {
    id: 'Glossary.unlock',
    defaultMessage: 'Unlock',
  },
  accept: {
    id: 'DirectOfferStatus.accept',
    defaultMessage: 'Accept',
  },
  loading: {
    id: 'LoadingIndicator.loading',
    defaultMessage: 'Loading',
  },
  ok: {
    id: 'AuctionNotification.ok',
    defaultMessage: 'OK',
  },
  search: {
    id: 'RefineList.searchPlaceholder',
    defaultMessage: 'Search',
  },
  signin: {
    id: 'ConnectionDialog.signin',
    defaultMessage: 'Sign in',
  },
  signup: {
    id: 'ConnectionDialog.signup',
    defaultMessage: 'Sign up',
  },
  logOut: {
    id: 'Settings.logOutAllDevices.submit',
    defaultMessage: 'Log Out',
  },
  coins: {
    id: 'Glossary.coins',
    defaultMessage: 'Coins',
  },
  completed: {
    id: 'Glossary.completed',
    defaultMessage: 'Completed',
  },
  enabled: {
    id: 'Settings.settingsSection.enabled',
    defaultMessage: 'Enabled',
  },
  disabled: {
    id: 'Settings.settingsSection.disabled',
    defaultMessage: 'Disabled',
  },
  discover: {
    id: 'glossary.discover',
    defaultMessage: 'Discover',
  },
  done: {
    id: 'Settings.recoveryCodesDialog.button',
    defaultMessage: 'Done',
  },
  yes: {
    id: 'WithdrawCancelDialog.confirmCta',
    defaultMessage: 'Yes',
  },
  no: {
    id: 'WithdrawCancelDialog.cancelCta',
    defaultMessage: 'No',
  },
  noGame: {
    id: 'glossary.noGame',
    defaultMessage: 'No game',
  },
  confirm: {
    id: 'ConfirmationDialogContent.confirm',
    defaultMessage: 'Confirm',
  },
  find: {
    id: 'glossary.find',
    defaultMessage: 'Find',
  },
  cancel: {
    id: 'Settings.PhoneNumberVerification.EnterVerificationCode.cancel',
    defaultMessage: 'Cancel',
  },
  canceled: {
    id: 'Glossary.canceled',
    defaultMessage: 'Canceled',
  },
  close: { id: 'Button.Close', defaultMessage: 'Close' },
  submit: {
    id: 'Prompt2faDialog.submit',
    defaultMessage: 'Submit',
  },
  back: {
    id: 'DialogOnboarding.Back',
    defaultMessage: 'Back',
  },
  next: {
    id: 'CreateClub.confirm',
    defaultMessage: 'Next',
  },
  previous: {
    id: 'Glossary.previous',
    defaultMessage: 'Previous',
  },
  continue: {
    id: 'UsedCardsDialog.continue',
    defaultMessage: 'Continue',
  },
  delete: {
    id: 'Lobby.Upcoming.Delete',
    defaultMessage: 'Delete',
  },

  discount: {
    id: 'Glossary.discount',
    defaultMessage: 'Discount',
  },
  create: {
    id: 'DeckForm.create',
    defaultMessage: 'Create',
  },
  update: {
    id: 'Settings.updateProfile.submit',
    defaultMessage: 'Update',
  },
  edit: {
    id: 'CardCollections.CollectionFulfilledSlot.EditButton',
    defaultMessage: 'Edit',
  },
  twofa: {
    id: 'Settings.disable2FA.dialogTitle',
    defaultMessage: 'Two-factor Authentication',
  },
  loadMore: {
    id: 'Nav.loadMore',
    defaultMessage: 'Load more',
  },
  cards: {
    id: 'Club.Data.cards',
    defaultMessage: 'Cards',
  },
  depositAction: {
    id: 'DepositEthForm.submit',
    defaultMessage: 'Deposit',
  },
  deposit: {
    id: 'TransactionsHistoryDeposit.title',
    defaultMessage: 'Deposit',
  },
  lineups: {
    id: 'Glossary.lineups',
    defaultMessage: 'Lineups',
  },
  ordinalStyled: {
    id: 'Glossary.ordinalStyled',
    defaultMessage:
      '{ordinal, selectordinal, one {#<sup>st</sup>} two {#<sup>nd</sup>} few {#<sup>rd</sup>} other {#<sup>th</sup>}}',
  },
  ordinal: {
    id: 'Glossary.ordinal',
    defaultMessage:
      '{ordinal, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}',
  },
  send: { id: 'Glossary.send', defaultMessage: 'Send' },
  share: { id: 'Glossary.share', defaultMessage: 'Share' },
  download: { id: 'Glossary.download', defaultMessage: 'Download' },
  copy: { id: 'Glossary.copy', defaultMessage: 'Copy' },
  shuffle: { id: 'Glossary.shuffle', defaultMessage: 'Shuffle' },
  receive: { id: 'Glossary.receive', defaultMessage: 'Receive' },
  reload: { id: 'Glossary.reload', defaultMessage: 'Reload' },
  fewMoments: { id: 'Glossary.fewMoments', defaultMessage: 'a few moments' },
  viewMore: { id: 'Glossary.ViewMore', defaultMessage: 'View More' },
  seeAll: { id: 'Glossary.SeeAll', defaultMessage: 'See all' },
  seeDetails: { id: 'Glossary.SeeDetails', defaultMessage: 'See details' },
  matches: { id: 'Glossary.matches', defaultMessage: 'Matches' },
  more: { id: 'Glossary.More', defaultMessage: 'More' },
  less: { id: 'Glossary.Less', defaultMessage: 'Less' },
  register: { id: 'Glossary.Register', defaultMessage: 'Register' },
  experiences: { id: 'Glossary.Experiences', defaultMessage: 'Experiences' },
  jerseys: { id: 'Glossary.Jerseys', defaultMessage: 'Jerseys' },
  tickets: { id: 'Glossary.Tickets', defaultMessage: 'Tickets' },
  pro: { id: 'Glossary.Pro', defaultMessage: 'Pro' },
  amateur: { id: 'Glossary.Amateur', defaultMessage: 'Amateur' },
  exclusive: { id: 'Glossary.Exclusive', defaultMessage: 'Exclusive' },
  viewDetails: {
    id: 'Glossary.ViewLineupDetails',
    defaultMessage: 'View details',
  },
  viewResults: {
    id: 'Glossary.ViewLineupResults',
    defaultMessage: 'View results',
  },
  new: { id: 'Glossary.New', defaultMessage: 'New' },
  owned: { id: 'Glossary.owned', defaultMessage: 'Owned' },
  claim: { id: 'Glossary.Claim', defaultMessage: 'Claim' },
  remove: { id: 'Draft.PlayerList.Cta.Remove', defaultMessage: 'Remove' },
  select: {
    id: 'Glossary.Select',
    defaultMessage: 'Select',
  },
  save: {
    id: 'Glossary.save',
    defaultMessage: 'Save',
  },
  verify: {
    id: 'Glossary.verify',
    defaultMessage: 'Verify',
  },
  accountEmail: {
    id: 'Settings.updateEmail.newTitle',
    defaultMessage: 'Account Email',
  },
  recoveryEmail: {
    id: 'Glossary.recoveryEmail',
    defaultMessage: 'Recovery email',
  },
  viewed: {
    id: 'Glossary.viewed',
    defaultMessage: 'Viewed',
  },
  resendVerificationCode: {
    id: 'Glossary.resendVerificationEmail',
    defaultMessage: 'Resend verification email',
  },
  buy: {
    id: 'BuyField.buy',
    defaultMessage: 'Buy now',
  },
  buyLowest: {
    id: 'BuyField.buyLowest',
    defaultMessage: 'Buy lowest price',
  },
  startingAt: {
    id: 'BuyField.startingAt',
    defaultMessage: 'Starting at',
  },
  addPhoneNumber: {
    id: 'accountSecurityCheck.phoneNumber.add',
    defaultMessage: 'Add phone number',
  },
  gw: {
    id: 'Glossary.gw',
    defaultMessage: 'GW',
  },
  rewards: {
    id: 'Glossary.rewards',
    defaultMessage: 'Rewards',
  },
  play: {
    id: 'Glossary.play',
    defaultMessage: 'Play',
  },
  playNow: {
    id: 'Glossary.playNow',
    defaultMessage: 'Play now',
  },
  howToPlay: {
    id: 'Glossary.howToPlay',
    defaultMessage: 'How to Play',
  },
  bestGame: {
    id: 'chart.bestGame',
    defaultMessage: 'Best game',
  },
  gotIt: {
    id: 'Glossary.gotIt',
    defaultMessage: 'Got it',
  },
  stats: {
    id: 'Glossary.stats',
    defaultMessage: 'Stats',
  },
  all: {
    id: 'Glossary.all',
    defaultMessage: 'All',
  },
  eth: {
    id: 'Glossary.eth',
    defaultMessage: 'ETH',
  },
  cash: {
    id: 'Glossary.cash',
    defaultMessage: 'Cash',
  },
  firstName: {
    id: 'Glossary.firstName',
    defaultMessage: 'First name',
  },
  lastName: {
    id: 'Glossary.lastName',
    defaultMessage: 'Last name',
  },
  countryOfResidence: {
    id: 'Glossary.countryOfResidence',
    defaultMessage: 'Country of residence',
  },
  nationality: {
    id: 'Glossary.nationality',
    defaultMessage: 'Nationality',
  },
  dateOfBirth: {
    id: 'Glossary.dateOfBirth',
    defaultMessage: 'Date of birth',
  },
  notMajorError: {
    id: 'Glossary.notMajorError',
    defaultMessage: 'You must be over 18.',
  },
  payWith: {
    id: 'Glossary.payWith',
    defaultMessage: 'Pay with',
  },
  showPlayerInfo: {
    id: 'Glossary.showPlayerInfo',
    defaultMessage: 'Show player info',
  },
  doItLater: {
    id: 'Glossary.doItLater',
    defaultMessage: 'I’ll do it later',
  },
  getStarted: {
    id: 'Draft.Action.GetStarted',
    defaultMessage: 'Get Started',
  },
});

export const tradeLabels = defineMessages({
  tradeWith: {
    id: 'Glossary.TradeWith',
    defaultMessage: 'Trade with {nickname}',
  },
  counterOfferWith: {
    id: 'Glossary.CounterOfferWith',
    defaultMessage: "Counter {nickname}'s trade",
  },
  youSend: {
    id: 'DealSummary.sendTitle',
    defaultMessage: 'You send',
  },
  usernameSends: {
    id: 'DirectOffer.usernameSends',
    defaultMessage: '<b>{username}</b> sends',
  },
  youReceive: {
    id: 'DealSummary.receiveTitle',
    defaultMessage: 'You receive',
  },
  youReceiveWithAvatar: {
    id: 'Glossary.youReceiveWithAvatar',
    defaultMessage: '<span>{nickname}</span> sends',
  },
});

export const navLabels = defineMessages({
  transferMarket: {
    id: 'navLabels.market',
    defaultMessage: 'Market',
  },
  auctions: {
    id: 'navLabels.auctions',
    defaultMessage: 'Auctions',
  },
  myClub: {
    id: 'Nav.myClub',
    defaultMessage: 'My Club',
  },
  clubHistory: {
    id: 'Nav.clubHistory',
    defaultMessage: 'Club History',
  },
  myCards: {
    id: 'Nav.myCards',
    defaultMessage: 'My Cards',
  },
  myMarketActivity: {
    id: 'Nav.myMarketActivity',
    defaultMessage: 'My Market Activity',
  },
  myGallery: {
    id: 'Nav.myGallery',
    defaultMessage: 'My Cards',
  },
  myProfile: {
    id: 'Nav.myProfile',
    defaultMessage: 'My Profile',
  },
  gamingArena: {
    id: 'Nav.gamingArena',
    defaultMessage: 'Play',
  },
  gamingCompetitions: {
    id: 'Nav.gamingCompetitions',
    defaultMessage: 'Competitions',
  },
  privateLeagues: {
    id: 'Nav.privateLeagues',
    defaultMessage: 'Private Leagues',
  },
  help: { id: 'Nav.help', defaultMessage: 'Help' },
  helpCenter: { id: 'Nav.helpCenter', defaultMessage: 'Help Center' },
  licensedClubs: {
    id: 'Nav.licensedClubs',
    defaultMessage: 'Licensed Clubs',
  },
  licensedPartners: {
    id: 'Nav.licensedPartners',
    defaultMessage: 'Licensed Partners',
  },
  coverage: {
    id: 'Nav.coverage',
    defaultMessage: 'Coverage',
  },
  settings: {
    id: 'Nav.settings',
    defaultMessage: 'Settings',
  },
  managerAssistant: {
    id: 'Nav.managerAssistant',
    defaultMessage: 'Manager Assistant',
  },
  myVicc: {
    id: 'Nav.myVicc',
    defaultMessage: 'My Vicc',
  },
  new: {
    id: 'Nav.new',
    defaultMessage: "What's New",
  },
  purchases: {
    id: 'Nav.purchases',
    defaultMessage: 'Manager Sales',
  },
  myAuctions: {
    id: 'Nav.myAuctions',
    defaultMessage: 'My Bids',
  },
  gameRules: {
    id: 'Nav.gameRules',
    defaultMessage: 'Game Rules',
  },
  careers: { id: 'Nav.careers', defaultMessage: 'Careers' },
  contact: {
    id: 'Nav.contact',
    defaultMessage: 'Contact',
  },
  press: {
    id: 'Nav.press',
    defaultMessage: 'Press',
  },
  terms: {
    id: 'Nav.terms',
    defaultMessage: 'Terms & Conditions',
  },
  play: {
    id: 'Nav.play',
    defaultMessage: 'Play',
  },
  privacyPolicy: {
    id: 'Nav.privacyPolicy',
    defaultMessage: 'Privacy Policy',
  },
  blog: {
    id: 'Nav.blog',
    defaultMessage: 'Blog',
  },
  affiliateProgram: {
    id: 'Nav.affiliateProgram',
    defaultMessage: 'Affiliate Program',
  },
  referralProgram: {
    id: 'Nav.referralProgram',
    defaultMessage: 'Invite Friends',
  },
  myListings: {
    id: 'Nav.myListings',
    defaultMessage: 'My Listings',
  },
  myPurchases: {
    id: 'Nav.myPurchases',
    defaultMessage: 'Manager Sales',
  },
  myOffersReceived: {
    id: 'Nav.myOffersReceived',
    defaultMessage: 'Offers Received',
  },
  myOffersSent: {
    id: 'Nav.myOffersSent',
    defaultMessage: 'Offers Sent',
  },
  myFollows: {
    id: 'Nav.myFollows',
    defaultMessage: 'Follows',
  },
  myTransactions: {
    id: 'Nav.myTransactions',
    defaultMessage: 'Transactions',
  },
  myPlayerNotifications: {
    id: 'Nav.myPlayerNotifications',
    defaultMessage: 'Player Notifications',
  },
  mlbSignUp: {
    id: 'Nav.mlbSignUp',
    defaultMessage: 'MLB: Sign up',
  },
  collections: {
    id: 'Nav.collections',
    defaultMessage: 'Collections',
  },
  cricketMarket: {
    id: 'Footer.cricketMarket',
    defaultMessage: 'Marketplace',
  },
  /*mlbMarket: {
    id: 'Footer.mlbMarket',
    defaultMessage: 'Vicc: MLB Market',
  },
  nbaMarket: {
    id: 'Footer.nbaMarket',
    defaultMessage: 'Vicc: NBA Market',
  },*/
  home: {
    id: 'Nav.Home',
    defaultMessage: 'Home',
  },
  clubHonors: {
    id: 'Nav.ClubHonors',
    defaultMessage: 'Club Honors',
  },
  prizePool: {
    id: 'Nav.PrizePool',
    defaultMessage: 'Prize pools',
  },
  market: {
    id: 'Nav.market',
    defaultMessage: 'Market',
  },
  clubshop: {
    id: 'Nav.clubshop',
    defaultMessage: 'Club Shop',
  },
  dailyGames: {
    id: 'Nav.dailyGames',
    defaultMessage: 'Daily Exhibitions (Beta)',
  },
  weekly: {
    id: 'Nav.weekly',
    defaultMessage: 'Weekly',
  },
});

export const managerHome = defineMessages({
  overview: {
    id: 'ManagerHome.Overview',
    defaultMessage: 'Overview',
  },
  cards: {
    id: 'ManagerHome.Cards',
    defaultMessage: 'My Cards',
  },
  cardCollections: {
    id: 'ManagerHome.CardCollections',
    defaultMessage: 'Collections',
  },
  awards: {
    id: 'ManagerHome.Awards',
    defaultMessage: 'Achievements',
  },
  squads: {
    id: 'ManagerHome.Squads',
    defaultMessage: 'Squads',
  },
});

export const galleryTabs = defineMessages({
  overview: {
    id: 'Gallery.Data.overview',
    defaultMessage: 'Overview',
  },
  cards: {
    id: 'Gallery.Data.cards',
    defaultMessage: 'Cards',
  },
  awards: {
    id: 'Gallery.Data.awards',
    defaultMessage: 'Achievements',
  },
  customDecks: {
    id: 'Gallery.Data.customDecks',
    defaultMessage: 'Squads',
  },
  cardCollections: {
    id: 'Gallery.Data.cardCollections',
    defaultMessage: 'Collections',
  },
  network: {
    id: 'Gallery.Data.network',
    defaultMessage: 'Managers',
  },
  clubHonors: {
    id: 'Gallery.Data.clubHonors',
    defaultMessage: 'Honors',
  },
});

export const userAttributes = defineMessages({
  nickname: {
    id: 'Users.nickname',
    defaultMessage: 'Username',
  },
  password: {
    id: 'Users.password',
    defaultMessage: 'Password',
  },
  email: {
    id: 'Global.user.email',
    defaultMessage: 'Email',
  },
  otpDisableAttempts: {
    id: 'Global.user.otpDisableAttempt',
    defaultMessage: 'Six-digit code OR recovery code',
  },
  phoneNumber: {
    id: 'Global.user.phoneNumber',
    defaultMessage: 'Phone number',
  },
  currency: {
    id: 'Global.user.currency',
    defaultMessage: 'Conversion',
  },
  fiatCurrency: {
    id: 'Global.user.fiatCurrency',
    defaultMessage: 'Currency',
  },
  clubName: {
    id: 'Global.user.clubName',
    defaultMessage: 'Club name',
  },
  status: {
    id: 'Global.user.status',
    defaultMessage: 'Status',
  },
});

export const sportsLabelsMessages = defineMessages({
  [Sport.CRICKET]: {
    id: 'sport.football',
    defaultMessage: 'Football',
  },
  [Sport.BASEBALL]: {
    id: 'sport.mlb',
    defaultMessage: 'MLB',
  },
  [Sport.NBA]: {
    id: 'sport.nba',
    defaultMessage: 'NBA',
  },
});

export const fantasy = defineMessages({
  alreadyJoined: {
    id: 'LeaguePicker.alreadyJoined',
    defaultMessage: 'Already joined',
  },
  bonus: {
    id: 'Fantasy.bonus',
    defaultMessage: 'Bonus',
  },
  captain: {
    id: 'Fantasy.captain',
    defaultMessage: 'Captain',
  },
  computed: {
    id: 'vicc5.waiting',
    defaultMessage: 'Waiting',
  },
  confirmDelete: {
    id: 'Lobby.Upcoming.ConfirmDelete',
    defaultMessage: 'Are you sure you want to delete your team?',
  },
  draft: { id: 'Fantasy.Draft', defaultMessage: 'Draft' },
  extraDraft: { id: 'Fantasy.ExtraDraft', defaultMessage: 'Extra Draft' },
  gameplay: { id: 'Fantasy.Gameplay', defaultMessage: 'Gameplay' },
  lineups: {
    id: 'Fantasy.Lineups',
    defaultMessage: 'Lineups',
  },
  live: {
    id: 'vicc5.live',
    defaultMessage: 'Live',
  },
  past: {
    id: 'vicc5.past',
    defaultMessage: 'Past',
  },
  gameWeek: {
    id: 'Fantasy.gameWeek',
    defaultMessage: 'Game Week {gameWeek}',
  },
  ended: {
    id: 'TimeLeft.ended',
    defaultMessage: 'Ended',
  },
  playerPerformance: {
    id: 'CardplayerPerformanceDialog.title',
    defaultMessage:
      'Player performance{gameWeek, select, none {} other { - GW {gameWeek}}}',
  },
  podiumRank: {
    id: 'Lobby.CompetitionDetails.Rewards.Podium.rank',
    defaultMessage:
      '{rank, selectordinal, one {#st} two {#nd} few {#rd} other {#th}} Place',
  },
  points: {
    id: 'Lobby.CompetitionDetails.Leaderboard.Score',
    defaultMessage: '{score, number, ::.00} pts',
  },
  pointsWithStyledScore: {
    id: 'Fantasy.points',
    defaultMessage: '<span>{score, number, ::.00}</span> pts',
  },
  prizePool: {
    id: 'CompetitionDetails.TabsItem.rewards',
    defaultMessage: 'Prize pool',
  },
  rank: {
    id: 'Fantasy.rank',
    defaultMessage: 'Rank',
  },
  redraft: { id: 'Fantasy.Redraft', defaultMessage: 'Redraft' },
  registerLineup: {
    id: 'Fantasy.RegisterLineup',
    defaultMessage: 'Register Lineup',
  },
  scarcities: {
    id: 'BenchFilter.scarcities',
    defaultMessage: 'Scarcities',
  },
  score: {
    id: 'Fantasy.score',
    defaultMessage: 'Score',
  },
  swap: { id: 'Fantasy.Swap', defaultMessage: 'Swap' },
  total: {
    id: 'Fantasy.total',
    defaultMessage: 'Total',
  },
  upcoming: {
    id: 'vicc5.upcoming',
    defaultMessage: 'Upcoming',
  },
  gw: {
    id: 'Fantasy.gameweekShort',
    defaultMessage: 'GW {week}',
  },
});

export const cardAttributes = defineMessages({
  age: { id: 'Cards.age', defaultMessage: 'Age' },
  averageScore: { id: 'Cards.averageScore', defaultMessage: 'Average score' },
  blockchainID: { id: 'Cards.blockchainID', defaultMessage: 'Blockchain ID' },
  bonus: { id: 'Cards.bonus', defaultMessage: 'Bonus' },
  level: { id: 'Cards.level', defaultMessage: 'Level' },
  player: { id: 'RefineList.player', defaultMessage: 'Player' },
  position: { id: 'RefineList.position', defaultMessage: 'Position' },
  serialNumber: { id: 'Cards.serialNumber', defaultMessage: 'Serial Number' },
  scarcity: { id: 'Cards.scarcity', defaultMessage: 'Scarcity' },
  season: { id: 'Cards.season', defaultMessage: 'Season' },
  shortLevel: { id: 'Cards.shortLevel', defaultMessage: 'lvl' },
  team: { id: 'RefineList.team', defaultMessage: 'Team' },
  cardTeam: { id: 'RefineList.cardTeam', defaultMessage: 'Card Team' },
  upcomingGame: {
    id: 'Cards.upcomingGame',
    defaultMessage: 'This player has an upcoming game.',
  },
  xpTitle: {
    id: 'Cards.xpTitle',
    defaultMessage: 'Total XP',
  },
  xpValue: {
    id: 'Cards.xpValue',
    defaultMessage: '{xp} XP',
  },
  seasonAverageScore: {
    id: 'CardProperties.averageScore.season',
    defaultMessage: 'Season average score',
  },
  L15Score: {
    id: 'CardSuggestion.averageScore.l15',
    defaultMessage: 'Average Score over Last 15 Games',
  },
  L15: {
    id: 'CardSuggestion.averageScore.l15Short',
    defaultMessage: 'Last 15 Games',
  },
});

export const draftLabels = defineMessages({
  selectYourPlayers: {
    id: 'Draft.Title.SelectPlayer',
    defaultMessage: 'Select your players',
  },
  redraft: {
    id: 'Draft.Action.Redraft',
    defaultMessage: 'Redraft Squad',
  },
});

export const filters = defineMessages({
  filters: {
    id: 'Activity.filterDialogTitle',
    defaultMessage: 'Filters',
  },
  noCardsFound: {
    id: 'EmptyGallery.noCardFound',
    defaultMessage: 'No Cards found',
  },
  noCardsOfTopicFound: {
    id: 'EmptyGallery.noCardsOfTopicFound',
    defaultMessage: 'No Cards of {topic} found',
  },
  clearAll: {
    id: 'ClearAllFilters.cta',
    defaultMessage: 'Clear all filters',
  },
  cardLevel: {
    id: 'RangeSlider',
    defaultMessage: 'Card Level',
  },
  price: {
    id: 'RangeSlider.price',
    defaultMessage: 'Price',
  },
  averageScore: {
    id: 'RangeSlider.averageScore',
    defaultMessage: 'Average Score',
  },
  lastFiveAverageScore: {
    id: 'RangeSlider.lastFiveAverageScore',
    defaultMessage: 'Last 5 Average Score',
  },
  lastFifteenAverageScore: {
    id: 'RangeSlider.lastFifteenAverageScore',
    defaultMessage: 'Last 15 Average Score',
  },
  appearances: {
    id: 'RangeSlider.appearances',
    defaultMessage: 'Games Played',
  },
  lastFiveAppearances: {
    id: 'RangeSlider.lastFiveAppearances',
    defaultMessage: 'Last 5 Appearances',
  },
  lastFifteenAppearances: {
    id: 'RangeSlider.lastFifteenAppearences',
    defaultMessage: 'Last 15 Appearances',
  },
  bundledSale: {
    id: 'RefineList.bundledSale',
    defaultMessage: 'Sale type',
  },
  activeClub: {
    id: 'RefineList.activeClub',
    defaultMessage: 'Current Club',
  },
  activeTeam: {
    id: 'RefineList.activeTeam',
    defaultMessage: 'Current Team',
  },
  activeNationalTeam: {
    id: 'RefineList.activeNationalTeam',
    defaultMessage: 'Current National Team',
  },
  nationality: {
    id: 'RefineList.nationality',
    defaultMessage: 'Nationality',
  },
  league: {
    id: 'RefineList.league',
    defaultMessage: 'League',
  },
  cardEdition: {
    id: 'RefineList.cardEdition',
    defaultMessage: 'Card edition',
  },
  customDeck: {
    id: 'RefineList.customDeck',
    defaultMessage: 'Squad',
  },
  customList: {
    id: 'RefineList.customList',
    defaultMessage: 'List',
  },
  nbaTenGameAverageScore: {
    id: 'RefineTenGameAverageScore.ten_game_average_score',
    defaultMessage: 'Ten Game Average',
  },
  mlbLastFifteenAverageScore: {
    id: 'RefineLastFifteenAverageScore.last_fifteen_average_score',
    defaultMessage: 'Last 15 average score',
  },
  mlbSeasonAverageScore: {
    id: 'RefineSeasonAverageScore.season_average_score',
    defaultMessage: 'Season average score',
  },
  mlbEligibleLeaderboards: {
    id: 'RefineList.eligible_leaderboards',
    defaultMessage: 'Eligible Leaderboards',
  },
  playingNextGameweekFilterLabel: {
    id: 'PlayingNextGameweekFilter.label',
    defaultMessage: 'Team plays next Game Week',
  },
  promotedCardsFilterTitle: {
    id: 'PromotedCards.title',
    defaultMessage: 'Special Event',
  },
  favoriteFilterLabel: {
    id: 'FavoriteFilter.label',
    defaultMessage: 'Only favorites',
  },
  notInLineupFilterLabel: {
    id: 'NotInLineupFilter.label',
    defaultMessage: 'Not in lineup',
  },
  collectibleFilterTitle: {
    id: 'CollectibleFilter.collectible',
    defaultMessage: 'Collectible',
  },
  nonPlayableCardsFilterLabel: {
    id: 'CollectibleFilter.showCustomSeriesCards',
    defaultMessage: 'Show Custom Series Cards',
  },
  legendFilterLabel: {
    id: 'CollectibleFilter.legendFilterLabel',
    defaultMessage: 'Show Legend Cards',
  },
  onSaleFilterLabel: {
    id: 'RefineOnSale.label',
    defaultMessage: 'Cards on sale',
  },
  showDetailsLabel: {
    id: 'ShowDetails.label',
    defaultMessage: 'Show details',
  },
  leagueFilterTitle: {
    id: 'LeagueFilter.competitionEligibility',
    defaultMessage: 'Competition Eligibility',
  },
  latestSeasonLabel: {
    id: 'RefineLatestSeason.label',
    defaultMessage: 'Latest season',
  },
  jerseySerialLabel: {
    id: 'JerseySerialFilter.label',
    defaultMessage: 'Matching player jersey number',
  },
  startedOnlyFilterLabel: {
    id: 'StartedOnlyFilter.label',
    defaultMessage: 'Not empty',
  },
});

export const sorts = defineMessages<AlgoliaCardIndexesName>({
  'Ending Soon': {
    id: 'SortCard.endingSoon',
    defaultMessage: 'Ending Soon',
  },
  'Highest Average Score': {
    id: 'SortCard.highestAverageScore',
    defaultMessage: 'Highest Average Score',
  },
  'Newly Listed': {
    id: 'SortCard.newlyListed',
    defaultMessage: 'Newly listed',
  },
  'Lowest Price': {
    id: 'SortCard.lowestPrice',
    defaultMessage: 'Lowest Price',
  },
  'Highest Price': {
    id: 'SortCard.highestPrice',
    defaultMessage: 'Highest Price',
  },
  'Cards Lowest Price': {
    id: 'SortCard.lowestPrice',
    defaultMessage: 'Lowest Price',
  },
  'Cards Highest Price': {
    id: 'SortCard.highestPrice',
    defaultMessage: 'Highest Price',
  },
  'Cards Highest Average Score': {
    id: 'SortCard.highestAverageScore',
    defaultMessage: 'Highest Average Score',
  },
  'Cards Player Name': {
    id: 'SortCard.playerName',
    defaultMessage: 'Player Name',
  },
  'Best Value': {
    id: 'SortCard.bestValue',
    defaultMessage: 'Best Value',
  },
  'Home Page Best Value': {
    id: 'SortCard.homePageBestValue',
    defaultMessage: 'Best Value',
  },
  'Popular Player': {
    id: 'SortCard.popularPlayer',
    defaultMessage: 'Popular Player',
  },
  'Home Page Popular Player': {
    id: 'SortCard.homePagePopularPlayer',
    defaultMessage: 'Home Page Popular Player',
  },
  'Cards New': {
    id: 'SortCards.new',
    defaultMessage: 'New',
  },
  Hottest: {
    id: 'SortCards.hottest',
    defaultMessage: 'Hottest',
  },
});

export const playerUnavailability = defineMessages({
  injuryTitle: {
    id: 'Draft.Card.injured',
    defaultMessage: 'Potential injury',
  },
  suspendedTitle: {
    id: 'Draft.Card.suspended',
    defaultMessage: 'Suspended',
  },
  unavailableSince: {
    id: 'Card.unavailabilty.unavailableSinceDate',
    defaultMessage: '(since {unavailableSince, date, long})',
  },
  expectedReturnDate: {
    id: 'Card.unavailability.expectedReturnDate',
    defaultMessage: 'Expected return date: {date, date, long}',
  },
  unknownReturnDate: {
    id: 'Card.unavailability.unknownReturnDate',
    defaultMessage: 'Unknown return date',
  },
  gamesUnavailableCount: {
    id: 'Card.suspension.gamesUnavailable',
    defaultMessage:
      '({gamesCount, plural, one {1 {competition} game} other {# {competition} games}})',
  },
});

export const playerGameStatusLabels = defineMessages({
  did_not_play_short: {
    id: 'Vicc5Stat.did_not_play_short',
    defaultMessage: 'DNP',
  },
  no_game_short: {
    id: 'Vicc5Stat.no_game_short',
    defaultMessage: 'NG',
  },
  did_not_play: {
    id: 'Vicc5Stat.did_not_play',
    defaultMessage: 'Did not play',
  },
  no_game: {
    id: 'Vicc5Stat.no_game',
    defaultMessage: 'No game (NG)',
  },
  not_covered: {
    id: 'Vicc5Stat.not_covered',
    defaultMessage: 'Not Covered',
  },
  uncertain_coverage: {
    id: 'Vicc5Stat.uncertain_coverage',
    defaultMessage: 'Delayed Coverage',
  },
  uncertain_coverage_detail: {
    id: 'Vicc5Stat.uncertain_coverage_detail',
    defaultMessage:
      'Full player data (All-Around scores + Decisive Scores) for this game will not be provided in real-time. It should update within 48 hours after full-time. However, if full player stats are not provided by our data partner before we finalise scoring at the end of the Game Week, only decisive stats will be scored.',
  },
  low_coverage: {
    id: 'Vicc5Stat.low_coverage',
    defaultMessage: 'Low Coverage',
  },
  low_coverage_detail: {
    id: 'Vicc5Stat.low_coverage_detail',
    defaultMessage:
      'Only Decisive Actions (eg goals, assists) will be scored for this game.',
  },
  pending: {
    id: 'Vicc5Stat.pending',
    defaultMessage: 'Pending',
  },
});

export const playerDetails = defineMessages({
  player_status: {
    id: 'InfoModal.playerStatus',
    defaultMessage: 'Player status',
  },
  performance: {
    id: 'InfoModal.performance',
    defaultMessage: 'Performance',
  },
  upcoming_games: {
    id: 'InfoModal.upcomingGames',
    defaultMessage: 'Upcoming games',
  },
});

export const wallet = defineMessages({
  addFunds: {
    id: 'bankEthAccounting.tabs.addFunds',
    defaultMessage: 'Add funds',
  },
  walletIsLockedTitle: {
    id: 'NewWalletDrawer.walletIsLockedTitle',
    defaultMessage: 'Unlock your wallet',
  },
  sixDigitsCode: {
    id: 'Global.user.sixDigitCode',
    defaultMessage: 'Six-digit code (Two-factor Authentication)',
  },
});

export const draft = defineMessages({
  autofill: {
    id: 'Draft.Picker.Autofill',
    defaultMessage: 'Auto fill',
  },
  autoComplete: {
    id: 'Draft.Picker.AutoComplete',
    defaultMessage: 'Auto Complete',
  },
  autofillPrompt: {
    id: 'Draft.Picker.AutofillPrompt',
    defaultMessage: 'Need help drafting?',
  },
  confirm: {
    id: 'Draft.Picker.Confirm',
    defaultMessage: 'Confirm draft',
  },
  clear: {
    id: 'Draft.Picker.Clear',
    defaultMessage: 'Clear Team',
  },
  submit: {
    id: 'Draft.Picker.Submit',
    defaultMessage: 'Submit',
  },
});

export const payment = defineMessages({
  balance: {
    id: 'PaymentBox.balance',
    defaultMessage: 'Balance',
  },
  sorareWallet: {
    id: 'Glossary.sorareWallet',
    defaultMessage: 'Vicc Wallet',
  },
  sorareEthWallet: {
    id: 'Glossary.sorareEthWallet',
    defaultMessage: 'ETH Wallet',
  },
  sorareCashWallet: {
    id: 'Glossary.sorareCashWallet',
    defaultMessage: 'Cash Wallet',
  },
  payment: {
    id: 'Glossary.payment',
    defaultMessage: 'Payment',
  },
  seller: {
    id: 'Glossary.seller',
    defaultMessage: 'Seller',
  },
  paymentBoxTitle: {
    id: 'Glossary.paymentBox.title',
    defaultMessage: 'Review & Pay',
  },
  confirmAndPay: {
    id: 'Glossary.paymentBox.confirmAndPay',
    defaultMessage: 'Confirm and Pay now',
  },
  applePay: {
    id: 'Glossary.applePay',
    defaultMessage: 'Apple Pay',
  },
  linkCo: {
    id: 'Glossary.LinkCo',
    defaultMessage: 'Link',
  },
  googlePay: {
    id: 'Glossary.googlePay',
    defaultMessage: 'Google Pay',
  },
});

export const transferMarket = defineMessages({
  buySellAndTradeCards: {
    id: 'TransferMarket.buySellAndTradeCards',
    defaultMessage: 'Buy, sell and trade cards',
  },
  new: {
    id: 'TransferMarket.primarySales',
    defaultMessage: 'New Card Auctions',
  },
  transfer: {
    id: 'TransferMarket.userSales',
    defaultMessage: 'Manager Sales',
  },
  transferDescription: {
    id: 'TransferMarket.userSalesDescription',
    defaultMessage: 'Buy, sell, and trade cards with other Managers.',
  },
  bundles: {
    id: 'TransferMarket.bundles',
    defaultMessage: 'Bundles',
  },
  starterPacks: {
    id: 'TransferMarket.starterPacks',
    defaultMessage: 'Starter Packs',
  },
  favorites: {
    id: 'TransferMarket.favorites',
    defaultMessage: 'My Favorites',
  },
  bestValue: {
    id: 'TransferMarket.bestValue',
    defaultMessage: 'Best value',
  },
  latestListing: {
    id: 'TransferMarket.latestListing',
    defaultMessage: 'Latest listing',
  },
  singleCards: {
    id: 'TransferMarket.singleCards',
    defaultMessage: 'Single cards',
  },
  bundle: {
    id: 'Bundle.bundle',
    defaultMessage: 'Bundle',
  },
});

export const fiatWallet = defineMessages({
  addCash: { id: 'FiatWallet.addCash', defaultMessage: 'Add cash' },
  addMyId: {
    id: 'FiatWallet.addMyId',
    defaultMessage: 'Add my ID',
  },
  activateCashWallet: {
    id: 'FiatWallet.activateCashWallet',
    defaultMessage: 'Activate my Cash Wallet',
  },
  activateCashWalletAndAddAnId: {
    id: 'FiatWallet.activateCashWalletAndAddAnId',
    defaultMessage: 'Activate Cash Wallet and add an ID',
  },
});
