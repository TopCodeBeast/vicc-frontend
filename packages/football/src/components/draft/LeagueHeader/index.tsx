import { gql } from '@apollo/client';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { ReactNode } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { LinkBox, LinkOverlay } from '@sorare/core/src/atoms/navigation/Box';
import { glossary } from '@sorare/core/src/lib/glossary';

import { LeagueHeader_competition } from './__generated__/index.graphql';

type Props = {
  competition?: LeagueHeader_competition;
  onClose?: () => void;
  onNext: () => void;
  children: ReactNode;
};

const Header = styled(LinkBox)<{
  backgroundColor: string;
  backgroundPictureUrl: string;
}>`
  height: 340px;
  background: ${({ backgroundColor, backgroundPictureUrl }) =>
    `url(${backgroundPictureUrl}) no-repeat top right/60%, ${backgroundColor}`};
  align-self: stretch;
`;

const StyledIconButton = styled(IconButton)`
  position: absolute;
  right: var(--double-unit);
  top: var(--double-unit);
`;

export const LeagueHeader = ({
  competition,
  children,
  onClose,
  onNext,
}: Props) => {
  const { formatMessage } = useIntl();
  return (
    <Header
      backgroundColor={competition?.backgroundColor || ''}
      backgroundPictureUrl={competition?.backgroundPictureUrl || ''}
    >
      {onClose && (
        <StyledIconButton
          color="white"
          icon={faTimes}
          onClick={onClose}
          aria-label={formatMessage(glossary.close)}
        />
      )}
      <LinkOverlay onClick={onNext}>{children}</LinkOverlay>
    </Header>
  );
};

LeagueHeader.fragments = {
  competition: gql`
    fragment LeagueHeader_competition on Competition {
      slug
      id
      backgroundColor
      backgroundPictureUrl
    }
  `,
};
