import {
  faArrowRight,
  faArrowUpRightFromSquare,
  faClose,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { ReactNode } from 'react';
import styled from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import {
  LinkBox,
  LinkOther,
  LinkOverlay,
} from '@sorare/core/src/atoms/navigation/Box';
import { Text14, Title4 } from '@sorare/core/src/atoms/typography';
import { isExternalDomain } from '@sorare/core/src/lib/urls';
import { Link } from '@sorare/core/src/routing/Link';
import { theme } from '@sorare/core/src/style/theme';
import { createVar } from '@sorare/core/src/style/utils';

import { useFootballEvents } from '@football/lib/events';

const bgColor = createVar();
const illustrationSize = createVar();

const HideButtonBox = styled(LinkOther)`
  position: absolute;
  top: var(--unit);
  right: var(--unit);
  @media (hover: hover) {
    display: none;
  }
`;
const Wrapper = styled(LinkBox)`
  ${bgColor}: var(--c-neutral-200);
  ${illustrationSize}: 240px;
  border-radius: ${theme.radius.md}px;
  display: flex;
  gap: var(--double-unit);
  padding: var(--double-unit) calc(var(${illustrationSize}) / 3)
    var(--double-unit) var(--double-unit);
  overflow: hidden;
  background: var(${bgColor});
  border: 1px solid transparent;
  color: var(--c-neutral-1000);
  opacity: 0.5;
  height: 100%;
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    padding-right: calc(var(${illustrationSize}) / 2);
  }
  &.hideSekeleton {
    opacity: 1;
    background: linear-gradient(var(${bgColor}), var(${bgColor})) padding-box,
      linear-gradient(84deg, #f8d3da 0%, #b3a9f4 30%, #fbe9fb 55%, #4f94fd 100%)
        border-box;
    &:hover,
    &:focus-within {
      ${bgColor}: var(--c-neutral-300);
      ${HideButtonBox} {
        display: block;
      }
    }
  }
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
`;

const ContentText = styled.div`
  flex: 1;
`;
const Subtitle = styled(Text14)`
  min-height: 5em; /** ~3 lines: 24*3/14 */
`;

const Img = styled.img`
  position: absolute;
  right: 0;
  width: var(${illustrationSize});
  height: var(${illustrationSize});
  object-fit: cover;
  transform: translateX(66%);
  border-radius: 50%;
  align-self: center;
  background: var(--c-neutral-300);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    transform: translateX(50%);
  }
`;

const Cta = styled(LinkOverlay)`
  font: var(--t-bolder) var(--t-14);
  display: inline-flex;
  gap: var(--unit);
  align-items: center;
  color: var(--c-neutral-1000);
  margin-top: var(--unit);
  &:hover,
  &:focus {
    color: inherit;
  }
`;

type Props = {
  title: string;
  subtitle: ReactNode;
  cta: ReactNode;
  illustration?: string | null;
  to: string;
  onHide: () => void;
};

export const ContentUnit = ({
  title,
  subtitle,
  cta,
  to,
  illustration,
  onHide,
}: Props) => {
  const track = useFootballEvents();
  const isExternal = isExternalDomain(to);
  const { pathname, search } = new URL(to, window.location.origin);
  const linkProps = isExternal
    ? {
        href: to,
        target: '_blank',
        rel: 'noreferrer',
      }
    : {
        to: pathname + search,
      };

  return (
    <Wrapper className={classnames({ hideSekeleton: !!cta })}>
      <Img
        src={
          illustration ||
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
          // transparent base64 image to avoid showing borders and keep the background intact if there is no illustration
        }
        alt=""
      />
      <Content>
        <ContentText>
          <Title4 color="var(--c-neutral-1000)">{title}</Title4>
          <Subtitle color="var(--c-neutral-600)">{subtitle}</Subtitle>
        </ContentText>
        {cta && (
          <Cta
            as={isExternal ? 'a' : Link}
            {...linkProps}
            onClick={() => {
              track('Click Content Unit', { title });
            }}
          >
            {cta}
            <FontAwesomeIcon
              icon={isExternal ? faArrowUpRightFromSquare : faArrowRight}
            />
          </Cta>
        )}
      </Content>
      {to && (
        <HideButtonBox>
          <IconButton
            icon={faClose}
            color="gray"
            small
            onClick={() => {
              onHide();
              track('Dismiss Content Unit', { title });
            }}
          />
        </HideButtonBox>
      )}
    </Wrapper>
  );
};
