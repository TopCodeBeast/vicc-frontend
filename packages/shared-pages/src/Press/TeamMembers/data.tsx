import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';

import { FRONTEND_ASSET_HOST } from '@sorare/core/src/constants/assets';

export type TeamMember = {
  name: string;
  role: ReactNode;
  pictureUrl?: string;
  bio?: ReactNode;
};
export const teamMembers: TeamMember[] = [
  {
    name: 'Nicolas Julia',
    role: (
      <FormattedMessage
        id="teamMembers.julia.role"
        defaultMessage="CEO and Co-founder"
      />
    ),
    pictureUrl: `${FRONTEND_ASSET_HOST}/pages/press/team/nicolasJulia.jpg`,
  },
  {
    name: 'Adrien Montfort',
    role: (
      <FormattedMessage
        id="teamMembers.montfort.role"
        defaultMessage="CTO and Co-founder"
      />
    ),
    pictureUrl: `${FRONTEND_ASSET_HOST}/pages/press/team/adrienMontfort.jpg`,
  },
  {
    name: 'Gabrielle Dorais',
    role: (
      <FormattedMessage
        id="teamMembers.dorais.role"
        defaultMessage="General Counsel"
      />
    ),
    pictureUrl: `${FRONTEND_ASSET_HOST}/pages/press/team/gabrielleDorais.jpg`,
  },
  {
    name: 'Thibaut Predhomme',
    role: (
      <FormattedMessage
        id="teamMembers.predhomme.role"
        defaultMessage="Chief of Staff"
      />
    ),
    pictureUrl: `${FRONTEND_ASSET_HOST}/pages/press/team/thibautPredhomme.jpg`,
  },
  {
    name: 'Paige Cutlip',
    role: (
      <FormattedMessage
        id="teamMembers.cutlip.role"
        defaultMessage="Head of Content, Community & Comms"
      />
    ),
  },
  {
    name: 'David Byttow',
    role: (
      <FormattedMessage
        id="teamMembers.byttow.role"
        defaultMessage="General Manager US Sports"
      />
    ),
  },
  {
    name: 'Aalok Kapoor',
    role: (
      <FormattedMessage
        id="teamMembers.kapoor.role"
        defaultMessage="General Manager Football"
      />
    ),
    pictureUrl: `${FRONTEND_ASSET_HOST}/pages/press/team/aalokKapoor.jpg`,
  },
  {
    name: 'Tu Nguyen',
    role: (
      <FormattedMessage
        id="teamMembers.nguyen.role"
        defaultMessage="Chief Financial Officer"
      />
    ),
  },
  {
    name: 'Kiana Davari',
    role: (
      <FormattedMessage
        id="teamMembers.davari.role"
        defaultMessage="Head of People"
      />
    ),
    pictureUrl: `${FRONTEND_ASSET_HOST}/pages/press/team/kianaDavari.jpg`,
  },
  {
    name: 'Michael Meltzer',
    role: (
      <FormattedMessage
        id="teamMembers.meltzer.role"
        defaultMessage="Head of Business Development"
      />
    ),
  },
];
