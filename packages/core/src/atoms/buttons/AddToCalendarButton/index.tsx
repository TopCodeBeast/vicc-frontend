import { faApple } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type CalendarEvent, google, ics, outlook } from 'calendar-link';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Dropdown from '@core/atoms/dropdowns/Dropdown';

import Button, { Props as ButtonProps } from '../Button';
import googleCalendarIcon from './assets/google-calendar.svg';
import outlookCalendarIcon from './assets/outlook-calendar.svg';

type LinkType = 'google' | 'outlook' | 'apple';

type Props = ButtonProps & {
  event: CalendarEvent;
  links?: LinkType[];
};

const functions: {
  [key in LinkType]: (calendarEvent: CalendarEvent) => string;
} = {
  google,
  outlook,
  apple: ics,
};

const titles: {
  [key in LinkType]: string;
} = {
  google: 'Google Calendar',
  outlook: 'Outlook Calendar',
  apple: 'Apple Calendar',
};

const icons: {
  [key in LinkType]: ReactNode;
} = {
  google: <img alt="Google Calendar" src={googleCalendarIcon} />,
  outlook: <img alt="Outlook Calendar" src={outlookCalendarIcon} />,
  apple: <FontAwesomeIcon icon={faApple} />,
};

const LinksWrapper = styled.div`
  width: 190px;
  display: flex;
  flex-direction: column;
`;

const Link = styled.a`
  display: inline-flex;
  align-items: center;
  gap: var(--unit);
  padding: var(--unit) var(--double-unit);
  text-align: left;
  color: var(--c-neutral-1000);

  &:hover {
    background-color: var(--c-neutral-300);
    color: var(--c-neutral-1000);
  }
`;

const LinkIcon = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
`;

export const AddToCalendarButton = ({
  event,
  links = ['google', 'apple', 'outlook'],
  ...buttonProps
}: Props) => {
  return (
    <Dropdown
      fullWidth
      label={
        <Button medium color="blue" fullWidth {...buttonProps}>
          <FormattedMessage
            id="AddToCalendarButton.addToCalendar"
            defaultMessage="Add to calendar"
          />
        </Button>
      }
    >
      {({ closeDropdown }) => (
        <LinksWrapper>
          {links.map(link => (
            <Link
              key={link}
              href={functions[link](event)}
              onClick={closeDropdown}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkIcon>{icons[link]}</LinkIcon>
              {titles[link]}
            </Link>
          ))}
        </LinksWrapper>
      )}
    </Dropdown>
  );
};
