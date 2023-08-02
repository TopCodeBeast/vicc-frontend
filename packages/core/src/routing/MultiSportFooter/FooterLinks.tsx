import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Text16 } from '@core/atoms/typography';
import { HREF_HELP, HREF_MEDIUM } from '@core/constants/externalLinks';
import {
  AFFILIATE_PROGRAM,
  CAREERS,
  FOOTBALL_MARKET,
  GAME_RULES,
  INVITE,
  LICENSED_PARTNERS,
  MLB_MARKET,
  NBA_MARKET,
  PRESS,
  PRIVACY_POLICY,
  TERMS,
} from '@core/constants/routes';
import useEvents from '@core/lib/events/useEvents';
import { navLabels } from '@core/lib/glossary';
import { mobileAndAbove, tabletAndAbove } from '@core/style/mediaQuery';

const FooterLink = styled(Text16)`
  display: block;
  padding: var(--half-unit) 0;
  color: var(--c-neutral-600);
  &:hover,
  &:focus {
    color: var(--c-neutral-100);
    text-decoration: underline;
  }
  @media ${tabletAndAbove} {
    color: var(--c-neutral-100);
  }
`;

const MenuItems = styled.div`
  display: grid;
  gap: var(--double-unit);
  justify-content: space-between;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  padding: var(--triple-unit) 0;
  @media ${mobileAndAbove} {
    grid-template-columns: repeat(2, 1fr);
  }
  @media ${tabletAndAbove} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const FooterLinks = () => {
  const track = useEvents();
  const trackLink = (source: string) => {
    track('Click Footer link', {
      source,
    });
  };
  const { formatMessage } = useIntl();

  return (
    <MenuItems>
      <div>
        <FooterLink
          as={Link}
          to={GAME_RULES}
          onClick={() => trackLink(GAME_RULES)}
        >
          {formatMessage(navLabels.gameRules)}
        </FooterLink>
        <FooterLink as={Link} to={TERMS} onClick={() => trackLink(TERMS)}>
          {formatMessage(navLabels.terms)}
        </FooterLink>
        <FooterLink
          as={Link}
          to={PRIVACY_POLICY}
          onClick={() => trackLink(PRIVACY_POLICY)}
        >
          {formatMessage(navLabels.privacyPolicy)}
        </FooterLink>
        <FooterLink
          as={Link}
          to={FOOTBALL_MARKET}
          onClick={() => trackLink(FOOTBALL_MARKET)}
        >
          {formatMessage(navLabels.footballMarket)}
        </FooterLink>
        <FooterLink
          as={Link}
          to={MLB_MARKET}
          onClick={() => trackLink(MLB_MARKET)}
        >
          {formatMessage(navLabels.mlbMarket)}
        </FooterLink>
        <FooterLink
          as={Link}
          to={NBA_MARKET}
          onClick={() => trackLink(NBA_MARKET)}
        >
          {formatMessage(navLabels.nbaMarket)}
        </FooterLink>
      </div>
      <div>
        <FooterLink as={Link} to={CAREERS} onClick={() => trackLink(CAREERS)}>
          {formatMessage(navLabels.careers)}
        </FooterLink>
        <FooterLink as={Link} to={PRESS} onClick={() => trackLink(PRESS)}>
          {formatMessage(navLabels.press)}
        </FooterLink>
        <FooterLink
          as="a"
          href={HREF_MEDIUM}
          onClick={() => trackLink(HREF_MEDIUM)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {formatMessage(navLabels.blog)}
        </FooterLink>
      </div>
      <div>
        <FooterLink
          as="a"
          href={HREF_HELP}
          onClick={() => trackLink(HREF_HELP)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {formatMessage(navLabels.help)}
        </FooterLink>
        <FooterLink as={Link} to={LICENSED_PARTNERS}>
          {formatMessage(navLabels.licensedPartners)}
        </FooterLink>
        <FooterLink
          as="a"
          href="https://help.sorare.com/hc/en-us/requests/new"
          onClick={() =>
            trackLink('https://help.sorare.com/hc/en-us/requests/new')
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          {formatMessage(navLabels.contact)}
        </FooterLink>
      </div>
      <div>
        <FooterLink
          as={Link}
          to={AFFILIATE_PROGRAM}
          onClick={() => trackLink(AFFILIATE_PROGRAM)}
        >
          {formatMessage(navLabels.affiliateProgram)}
        </FooterLink>
        <FooterLink as={Link} to={INVITE} onClick={() => trackLink(INVITE)}>
          {formatMessage(navLabels.referralProgram)}
        </FooterLink>
      </div>
    </MenuItems>
  );
};

export default FooterLinks;
