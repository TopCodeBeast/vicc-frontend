import { TypedDocumentNode, gql } from '@apollo/client';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { parseISO } from 'date-fns';
import dompurify from 'dompurify';
import { useCallback, useMemo } from 'react';
import styled from 'styled-components';

import IconButton from '@core/atoms/buttons/IconButton';
import { Caption, Title2 } from '@core/atoms/typography';
import { ACTIVITY } from '@core/constants/routes';
import { useIntlContext } from '@core/contexts/intl';
import idFromObject from '@core/gql/idFromObject';
import { useBgLocation } from '@core/hooks/useBgLocation';
import useEvents from '@core/lib/events/useEvents';
import getSafePreviousLocation from '@core/lib/navigation/getSafePreviousLocation';
import { isExternalDomain, toRelative } from '@core/lib/urls';
import { ClickAnnouncementLink } from '@core/protos/events/platform/web/events';
import { Link } from '@core/routing/Link';

import { Announcement_announcement } from './__generated__/index.graphql';

type Props = {
  announcement: Announcement_announcement;
};

const Root = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--double-unit);
  img {
    max-width: 100%;
    max-height: 30vh;
    display: block;
    margin: auto;
  }
  & a {
    color: var(--c-link);
    text-decoration: underline;
  }
`;
const Header = styled.header`
  display: flex;
  justify-content: space-between;
`;

export const Announcement = ({ announcement }: Props) => {
  const { formatDistanceToNow } = useIntlContext();
  const track = useEvents();
  const bgLocation = useBgLocation();
  const safePreviousLocation = getSafePreviousLocation(ACTIVITY);
  const { id, title, content, createdAt } = announcement;

  const trackClickLink = useCallback(
    (a: HTMLAnchorElement) => {
      const params: ClickAnnouncementLink = {
        announcementId: id,
        announcementTitle: title,
        linkHref: a.href,
      };
      track('Click Announcement Link', params);
    },
    [track, id, title]
  );

  const preparedContent = useMemo(() => {
    const div = document.createElement('div');
    div.innerHTML = content;

    div.querySelectorAll('a').forEach((a: HTMLAnchorElement) => {
      const isExternal = isExternalDomain(a.href);

      if (isExternal) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      } else {
        a.href = toRelative(a.href);
      }
    });

    return dompurify.sanitize(div.innerHTML, { ADD_ATTR: ['target'] });
  }, [content]);

  return (
    <Root id={idFromObject(announcement.id)}>
      <Header>
        <div>
          <Title2>{title}</Title2>
          <Caption color="var(--c-neutral-600)">
            {formatDistanceToNow(parseISO(createdAt))}
          </Caption>
        </div>
        {bgLocation && (
          <IconButton
            color="white"
            icon={faTimes}
            component={Link}
            to={safePreviousLocation as string}
          />
        )}
      </Header>
      {/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
      <div
        /* eslint-disable-next-line react/no-danger */
        dangerouslySetInnerHTML={{ __html: preparedContent }}
        onClick={e => {
          const target = e.target as HTMLElement;
          const link = target.closest('a');
          if (link) {
            trackClickLink(link);
          }
        }}
      />
      {/* eslint-enable jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
    </Root>
  );
};

Announcement.fragments = {
  announcement: gql`
    fragment Announcement_announcement on Announcement {
      id
      title
      content
      createdAt
    }
  ` as TypedDocumentNode<Announcement_announcement>,
};

export default Announcement;
