import { defineMessages } from 'react-intl';

export const metadatas = {
  default: defineMessages({
    title: {
      id: 'Meta.common.default.title',
      defaultMessage: 'Vicc: Own Your Game',
    },
    description: {
      id: 'Meta.common.default.description',
      defaultMessage:
        "Collect, play and win officially licensed digital cards featuring the world's best global football, MLB and NBA players.",
    },
  }),
  landing: defineMessages({
    title: {
      id: 'Meta.common.landing.title',
      defaultMessage:
        'Play Vicc fantasy football, NBA, MLB w/ownable player cards',
    },
    description: {
      id: 'Meta.common.landing.description',
      defaultMessage:
        'Play Vicc’s free fantasy football, MLB & NBA games. Collect, buy, sell and compete with ownable digital player cards to win rewards.',
    },
  }),
  card: defineMessages({
    title: {
      id: 'Meta.common.Card.title',
      defaultMessage: '{scarcity} Card of {display_name} – {season} – Vicc',
    },
    description: {
      id: 'Meta.common.Card.description',
      defaultMessage:
        'Collect, trade and play with {display_name} Vicc Cards available in different scarcities and own your game',
    },
  }),
  player: defineMessages({
    title: {
      id: 'Meta.common.player.title',
      defaultMessage: '{display_name} – Player Profile – Vicc',
    },
    description: {
      id: 'Meta.common.player.description',
      defaultMessage:
        'Find all the statistics of {display_name}. Collect and trade officially licensed digital cards of your favourite player on Vicc',
    },
  }),
  userGallery: defineMessages({
    title: {
      id: 'Meta.common.userGallery.title',
      defaultMessage: '{username}’s Gallery and Profile – Vicc',
    },
    description: {
      id: 'Meta.common.userGallery.description',
      defaultMessage: '{username} Vicc Cards gallery and Profile',
    },
  }),
  managerHome: defineMessages({
    title: {
      id: 'Meta.common.managerHome.title',
      defaultMessage: 'Manager Home – Vicc',
    },
    description: {
      id: 'Meta.common.managerHome.description',
      defaultMessage: '{username} Vicc Manager Home',
    },
  }),
  myGallery: defineMessages({
    title: {
      id: 'Meta.common.myGallery.title',
      defaultMessage: 'My Gallery – Vicc',
    },
    description: {
      id: 'Meta.common.myGallery.description',
      defaultMessage: '{username} Vicc Cards gallery',
    },
  }),
  press: defineMessages({
    title: {
      id: 'Meta.common.press.title',
      defaultMessage: 'Press articles about us',
    },
  }),
  licensedPartners: defineMessages({
    title: {
      id: 'Meta.common.licensedPartners.title',
      defaultMessage: '300+ licensed clubs',
    },
    description: {
      id: 'Meta.common.licensedPartners.description',
      defaultMessage:
        'We have partnered with the top sport clubs in the world to provide the best game experience to our users.',
    },
  }),
};
