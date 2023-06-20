import { defineMessages } from 'react-intl';

export const metadatas = {
  default: defineMessages({
    title: {
      id: 'Meta.common.default.title',
      defaultMessage: 'Sorare: Own Your Game',
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
        'Play Sorare fantasy football, NBA, MLB w/ownable player cards',
    },
    description: {
      id: 'Meta.common.landing.description',
      defaultMessage:
        'Play Sorare’s free fantasy football, MLB & NBA games. Collect, buy, sell and compete with ownable digital player cards to win rewards.',
    },
  }),
  card: defineMessages({
    title: {
      id: 'Meta.common.Card.title',
      defaultMessage: '{scarcity} Card of {display_name} – {season} – Sorare',
    },
    description: {
      id: 'Meta.common.Card.description',
      defaultMessage:
        'Collect, trade and play with {display_name} Sorare Cards available in different scarcities and own your game',
    },
  }),
  player: defineMessages({
    title: {
      id: 'Meta.common.player.title',
      defaultMessage: '{display_name} – Player Profile – Sorare',
    },
    description: {
      id: 'Meta.common.player.description',
      defaultMessage:
        'Find all the statistics of {display_name}. Collect and trade officially licensed digital cards of your favourite player on Sorare',
    },
  }),
  userGallery: defineMessages({
    title: {
      id: 'Meta.common.userGallery.title',
      defaultMessage: '{username}’s Gallery and Profile – Sorare',
    },
    description: {
      id: 'Meta.common.userGallery.description',
      defaultMessage: '{username} Sorare Cards gallery and Profile',
    },
  }),
  managerHome: defineMessages({
    title: {
      id: 'Meta.common.managerHome.title',
      defaultMessage: 'Manager Home – Sorare',
    },
    description: {
      id: 'Meta.common.managerHome.description',
      defaultMessage: '{username} Sorare Manager Home',
    },
  }),
  myGallery: defineMessages({
    title: {
      id: 'Meta.common.myGallery.title',
      defaultMessage: 'My Gallery – Sorare',
    },
    description: {
      id: 'Meta.common.myGallery.description',
      defaultMessage: '{username} Sorare Cards gallery',
    },
  }),
  press: defineMessages({
    title: {
      id: 'Meta.common.press.title',
      defaultMessage: 'Press articles about us',
    },
  }),
};
