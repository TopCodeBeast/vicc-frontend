import { TypedDocumentNode, gql } from '@apollo/client';
import { Collapse } from '@material-ui/core';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled from 'styled-components';

import { Text16, Title6 } from '@sorare/core/src/atoms/typography';
import { Nickname } from '@sorare/core/src/components/user/Nickname';
import useToggle from '@sorare/core/src/hooks/useToggle';

import DirectOfferBody from '../DirectOfferBody';
import {
  CounteredOffer_publicUserInfoInterface,
  CounteredOffer_tokenOffer,
} from './__generated__/index.graphql';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--half-unit);
`;

const Offer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--c-neutral-300);
  padding: var(--double-unit);
  gap: var(--double-unit);
  border-radius: var(--intermediate-unit);
`;
const Button = styled.button`
  color: var(--c-brand-600);
`;

const Warning = styled(Text16)`
  padding: var(--unit) var(--double-unit);
  background-color: rgba(var(--c-rgb-yellow-600), 0.25);
  color: var(--c-neutral-1000);
  font-weight: 400;
  border-radius: var(--intermediate-unit);
`;

const StyledCollapse = styled(Collapse)`
  width: 100%;
`;

const messages = defineMessages({
  title: {
    id: 'CounteredOffer.title',
    defaultMessage: 'You send this counter offer to {username}',
  },
  wasCurrentUserSenderTitle: {
    id: 'CounteredOffer.wasCurrentUserSenderTitle',
    defaultMessage: 'This is a counteroffer from {username}',
  },
  expandCta: {
    id: 'CounteredOffer.expandCta',
    defaultMessage: 'Show previous offer details',
  },
  expandedCta: {
    id: 'CounteredOffer.expandedCta',
    defaultMessage: 'Hide previous offer details',
  },
  offerTitle: {
    id: 'CounteredOffer.offerTitle',
    defaultMessage: 'Previous offer details',
  },
  offerWarning: {
    id: 'CounteredOffer.offerWarning',
    defaultMessage:
      'This offer is no longer valid because you sent a counter offer.',
  },
  wasCurrentUserSenderOfferWarning: {
    id: 'CounteredOffer.wasCurrentUserSenderOfferWarning',
    defaultMessage:
      'This offer was countered by {username} and it is no longer valid.',
  },
});

type Props = {
  offer: CounteredOffer_tokenOffer;
  wasCurrentUserSender: boolean;
  counterpartUser: CounteredOffer_publicUserInfoInterface;
};

const CounteredOffer = ({
  offer,
  wasCurrentUserSender,
  counterpartUser,
}: Props) => {
  const [expanded, toggleExpanded] = useToggle(false);
  return (
    <Container>
      <Text16 bold>
        <FormattedMessage
          {...(wasCurrentUserSender
            ? messages.wasCurrentUserSenderTitle
            : messages.title)}
          values={{
            username: <Nickname user={counterpartUser} />,
          }}
        />
      </Text16>
      <Button type="button" onClick={toggleExpanded}>
        <Text16 bold>
          <FormattedMessage
            {...(expanded ? messages.expandedCta : messages.expandCta)}
          />
        </Text16>
      </Button>

      <StyledCollapse in={expanded}>
        <Offer>
          <Title6>
            <FormattedMessage {...messages.offerTitle} />
          </Title6>
          <Warning>
            <FormattedMessage
              {...(wasCurrentUserSender
                ? messages.wasCurrentUserSenderOfferWarning
                : messages.offerWarning)}
              values={{
                username: <Nickname user={counterpartUser} />,
              }}
            />
          </Warning>
          <DirectOfferBody
            offer={offer}
            counterpartUser={counterpartUser}
            isCurrentUserSender={wasCurrentUserSender}
          />
        </Offer>
      </StyledCollapse>
    </Container>
  );
};
CounteredOffer.fragments = {
  user: gql`
    fragment CounteredOffer_publicUserInfoInterface on PublicUserInfoInterface {
      slug
      ...Nickname_publicUserInfoInterface
    }
    ${Nickname.fragments.user}
  ` as TypedDocumentNode<CounteredOffer_publicUserInfoInterface>,
  tokenOffer: gql`
    fragment CounteredOffer_tokenOffer on Offer {
      id
      blockchainId
      sender {
        ... on User {
          slug
          ...Nickname_publicUserInfoInterface
        }
      }
      receiver {
        ... on User {
          slug
          ...Nickname_publicUserInfoInterface
        }
      }
      ...MyViccDirectOfferBody_tokenOffer
    }
    ${DirectOfferBody.fragments.tokenOffer}
    ${Nickname.fragments.user}
  ` as TypedDocumentNode<CounteredOffer_tokenOffer>,
};

export default CounteredOffer;
