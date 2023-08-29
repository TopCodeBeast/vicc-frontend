import { TypedDocumentNode, gql } from '@apollo/client';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { Sport } from '@sorare/core/src/__generated__/globalTypes';
import { Container } from '@sorare/core/src/atoms/container';
import LoadingIndicator from '@sorare/core/src/atoms/loader/LoadingIndicator';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

import { FootballClubs } from './FootballClubs';
import { FootballCompetitions } from './FootballCompetitions';
import { USSportClubs } from './USSportClubs';
import { PartnersList_club } from './__generated__/index.graphql';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  scroll-behavior: smooth;
  z-index: 3;
  position: relative;
  background: var(--c-neutral-100);
  color: var(--c-neutral-1000);
  height: calc(100vh - var(--navbar-height-mobile));
  @media ${tabletAndAbove} {
    height: calc(100vh - var(--navbar-height-desktop));
  }
`;

type Props = {
  footballClubs: Nullable<PartnersList_club[]>;
  header: ReactNode;
  footer: ReactNode;
  sport: string | undefined;
  tab?: string;
  loading?: boolean;
};

export const PartnersList = ({
  footballClubs,
  header,
  footer,
  sport,
  tab,
  loading,
}: Props) => {
  const getContentView = () => {
    if (tab === 'competitions') {
      return <FootballCompetitions />;
    }
    if (loading) {
      return <LoadingIndicator />;
    }
    return <FootballClubs clubs={footballClubs} />;
  };
  return (
    <Wrapper>
      {header}
      <Container>{getContentView()}</Container>
      {footer}
    </Wrapper>
  );
};

PartnersList.fragments = {
  club: gql`
    fragment PartnersList_club on Club {
      slug
      ...FootballClubs_club
    }
    ${FootballClubs.fragments.club}
  ` as TypedDocumentNode<PartnersList_club>,
};
