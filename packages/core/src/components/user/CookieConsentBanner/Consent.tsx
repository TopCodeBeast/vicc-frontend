import { faCaretRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Switch } from '@material-ui/core';
// import { Destination } from '@segment/consent-manager/types/types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Button from '@core/atoms/buttons/Button';
import { Text16 } from '@core/atoms/typography';
import { glossary } from '@core/lib/glossary';

import LinkToCookiePolicy from './LinkToCookiePolicy';

const Root = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: var(--c-neutral-1000);
  .dark-theme & {
    background: var(--c-neutral-200);
  }
`;
const Title = styled.h2`
  font-size: 24px;
  margin: 0px 0px 10px;
`;
const Category = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;
const CategoryTitle = styled.div`
  font-weight: bold;
`;
const Destinations = styled.div`
  color: var(--c-neutral-600);
  & > *:not(:last-child):after {
    content: ', ';
  }
`;
const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const Continue = styled.button`
  border: none;
  padding: 0;
  margin: 0;
  background: 0;
  display: flex;
  align-self: flex-end;
  gap: 0.5em;
  align-items: center;
  cursor: pointer;
  font: inherit;
  color: var(--c-neutral-600);
`;

type Destination = any;

type Props = {
  saveConsent: (agree?: boolean) => void;
  seeDetails: () => void;
};

export const SimpleConsent = ({ saveConsent, seeDetails }: Props) => {
  return (
    <Root>
      <Continue type="button" onClick={() => saveConsent(false)}>
        <FormattedMessage
          tagName="span"
          id="CookieConsentBanner.reject"
          defaultMessage="Continue without agreeing"
        />
        <FontAwesomeIcon icon={faCaretRight} />
      </Continue>
      <div>
        <Title>
          <FormattedMessage
            id="CookieConsentBanner.title"
            defaultMessage="Sorare respects your privacy"
          />
        </Title>
        <Text16 color="var(--c-neutral-600)">
          <FormattedMessage
            id="CookieConsentBanner.description"
            defaultMessage="We use cookies to provide you with the best browsing experience. The data collected by cookies is used to optimise the website for our visitors and deliver targeted information to Sorare users."
          />
        </Text16>
        <Text16 color="var(--c-neutral-600)">
          <FormattedMessage
            id="CookieConsentBanner.cookie_policy"
            defaultMessage="To learn more, check our <link>Cookie Policy</link>."
            values={{
              link: LinkToCookiePolicy,
            }}
          />
        </Text16>
      </div>
      <Actions>
        <Button type="button" medium color="white" onClick={seeDetails}>
          <FormattedMessage tagName="span" {...glossary.seeDetails} />
        </Button>

        <Button
          type="button"
          medium
          color="blue"
          onClick={() => {
            saveConsent(true);
          }}
        >
          <FormattedMessage
            id="CookieConsentBanner.agree"
            defaultMessage="Agree"
          />
        </Button>
      </Actions>
    </Root>
  );
};

type DetailedProps = {
  saveConsent: (agree?: boolean) => void;
  destinations: Destination[];
  preferences: { [key: string]: boolean | null | undefined };
  setPreferences: (newvalue: { [id: string]: boolean }) => void;
};

export const DetailedConsent = ({
  saveConsent,
  destinations,
  preferences,
  setPreferences,
}: DetailedProps) => {
  const categories: { [key: string]: Destination[] } = {};
  destinations.forEach(d => {
    if (!(d.category in categories)) {
      categories[d.category] = [];
    }
    categories[d.category].push(d);
  });

  const setCategory = (category: string, consent: boolean) => {
    setPreferences(
      Object.fromEntries(categories[category].map(d => [d.id, consent]))
    );
  };

  return (
    <Root>
      <div>
        <Title>
          <FormattedMessage
            id="CookieConsentBanner.details.title"
            defaultMessage="Your preferences"
          />
        </Title>

        <Text16 color="var(--c-neutral-600)">
          <FormattedMessage
            id="CookieConsentBanner.details.description"
            defaultMessage="We and our partners use cookies and non sensible information from your device to improve our product."
          />
        </Text16>
        <Text16 color="var(--c-neutral-600)">
          <FormattedMessage
            id="CookieConsentBanner.details.description2"
            defaultMessage="You can accept or reject those operations."
          />
        </Text16>
        <Text16 color="var(--c-neutral-600)">
          <FormattedMessage
            id="CookieConsentBanner.details.cookie_policy"
            defaultMessage="To learn more about the cookies, the data, the processings we do and the partners we work with, you can check our <link>cookie policy</link>."
            values={{
              link: LinkToCookiePolicy,
            }}
          />
        </Text16>
      </div>
      {Object.keys(categories).map(category => {
        const accepted = categories[category].every(
          destination => preferences[destination.id] === true
        );
        return (
          <Category key={category}>
            <div>
              <CategoryTitle>{category}</CategoryTitle>
              <Destinations>
                {categories[category].map(destination => (
                  <span key={destination.id}>{destination.name}</span>
                ))}
              </Destinations>
            </div>
            <Switch
              checked={accepted}
              onChange={() => setCategory(category, !accepted)}
            />
          </Category>
        );
      })}
      <Actions>
        <Button
          medium
          color="white"
          onClick={() => {
            saveConsent(false);
          }}
        >
          <FormattedMessage
            id="CookieConsentBanner.details.reject"
            defaultMessage="Reject all"
          />
        </Button>

        <Button
          medium
          color="blue"
          onClick={() => {
            saveConsent();
          }}
        >
          <FormattedMessage
            id="CookieConsentBanner.details.agree"
            defaultMessage="Accept selected"
          />
        </Button>
      </Actions>
    </Root>
  );
};
