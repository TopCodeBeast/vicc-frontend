import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import styled from 'styled-components';

import Dropdown from '@sorare/core/src/atoms/dropdowns/Dropdown';
import useEvents from '@sorare/core/src/lib/events/useEvents';

export type Social =
  | 'twitter'
  | 'instagram'
  | 'discord'
  | 'reddit'
  | 'youtube'
  | 'facebook';

interface Link {
  label: string;
  link: string;
}

const SocialLink = styled.a`
  transition: 0.15s ease color;
  position: relative;
  cursor: pointer;
  color: var(--c-neutral-100);
  padding: var(--unit);
  font-size: 22px;
  &:hover,
  &:focus {
    &.instagram {
      color: var(--c-social-instagram);
    }
    &.twitter {
      color: var(--c-social-twitter);
    }
    &.discord {
      color: var(--c-social-discord);
    }
    &.reddit {
      color: var(--c-social-reddit);
    }
    &.youtube {
      color: var(--c-social-youtube);
    }
    &.facebook {
      color: var(--c-social-facebook);
    }
    &.tiktok {
      color: var(--c-social-tiktok);
    }
  }
`;

const Link = styled.a`
  color: var(--c-neutral-1000);
  display: block;
  padding: var(--unit) var(--double-unit);
  &:not(:last-child) {
    border-bottom: 1px solid var(--c-neutral-300);
  }
`;

export interface SocialLinkProps {
  social: string;
  icon: IconDefinition;
  links: Link[];
  className?: string;
}
const SocialItem = ({ icon, links, social }: SocialLinkProps) => {
  const track = useEvents();
  const trackLink = (source: string) => {
    track('Click Footer link', {
      source,
    });
  };
  if (links.length === 1) {
    return (
      <SocialLink
        href={links[0].link}
        target="_blank"
        rel="noopener noreferrer"
        className={classnames(social)}
        onClick={() => trackLink(social)}
      >
        <FontAwesomeIcon icon={icon} />
      </SocialLink>
    );
  }
  return (
    <Dropdown
      triggerOnHover
      onChange={() => {}}
      label={
        <SocialLink as="button" type="button" className={classnames(social)}>
          <FontAwesomeIcon icon={icon} />
        </SocialLink>
      }
    >
      <>
        {links.map(({ link, label }) => {
          return (
            <Link
              key={label}
              href={link}
              onClick={() => trackLink(link)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {label}
            </Link>
          );
        })}
      </>
    </Dropdown>
  );
};

const Root = styled.div`
  display: flex;
  gap: var(--double-unit);
  overflow: auto;
  max-width: 100%;
  margin: 0 calc(var(--unit) * -1);
`;

type Props = {
  socialLinks: SocialLinkProps[];
};
export const SocialLinks = ({ socialLinks }: Props) => {
  return (
    <Root>
      {socialLinks.map(socialLink => {
        return (
          <SocialItem
            key={socialLink.social}
            icon={socialLink.icon}
            links={socialLink.links}
            social={socialLink.social}
          />
        );
      })}
    </Root>
  );
};
