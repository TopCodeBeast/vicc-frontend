import { ReactNode } from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Text14, Text16 } from '@sorare/core/src/atoms/typography';
import { LiveIndicator } from '@sorare/core/src/atoms/ui/LiveIndicator';
import useScreenSize from '@sorare/core/src/hooks/device/useScreenSize';
import { theme } from '@sorare/core/src/style/theme';

import { useFootballEvents } from 'lib/events';

const EntryRoot = styled.button.attrs({ type: 'button' })`
  text-align: left;
  display: flex;
  align-items: initial;
  background-color: var(--c-neutral-200);
  border-radius: var(--unit);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    flex-direction: column;
    transition: transform 0.2s ease-in-out;
    &:hover,
    &:focus {
      transform: translateY(calc(-1 * var(--half-unit)));
    }
  }
`;
const Image = styled.div`
  width: 95px;
  display: flex;
  border-radius: var(--unit) 0 0 var(--unit);
  overflow: hidden;

  img {
    max-width: 100%;
    object-fit: cover;
  }

  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    width: 100%;
    border-radius: var(--unit) var(--unit) 0 0;
  }
`;
const Content = styled.div`
  flex: 1;
  align-self: center;
  padding: var(--intermediate-unit) var(--double-unit);
  display: flex;
  flex-direction: column;
  gap: var(--intermediate-unit);
  @media (min-width: ${theme.breakpoints.values.tablet}px) {
    flex: 0;
    margin-top: auto;
    align-self: flex-start;
    justify-content: space-between;
    padding: var(--double-unit);
  }
`;
const SubContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--half-unit);
`;
const Count = styled.div`
  display: flex;
  align-items: center;
  gap: var(--unit);
`;
const Circle = styled(LiveIndicator)`
  --rgb-bg-color: var(--c-rgb-brand-600);
`;

export const Entry = ({
  to,
  title,
  description,
  countMessage,
  count,
  desktopImage,
  mobileImage,
}: {
  to: string;
  title: MessageDescriptor;
  description: MessageDescriptor;
  countMessage: MessageDescriptor;
  count: number;
  desktopImage: ReactNode;
  mobileImage: ReactNode;
}) => {
  const { up: isTablet } = useScreenSize('tablet');
  const track = useFootballEvents();

  return (
    <EntryRoot
      as={Link}
      to={to}
      onClick={() =>
        track('Redirect To Marketplace', {
          destination: to,
        })
      }
    >
      <Image>{isTablet ? desktopImage : mobileImage}</Image>
      <Content>
        <SubContent>
          <Text16 bold color="var(--c-neutral-1000)">
            <FormattedMessage {...title} />
          </Text16>
          <Text16 color="var(--c-neutral-600)">
            <FormattedMessage {...description} />
          </Text16>
        </SubContent>
        <Count>
          <Circle />
          <Text14 color="var(--c-neutral-1000)">
            <FormattedMessage
              {...countMessage}
              values={{
                count,
              }}
            />
          </Text14>
        </Count>
      </Content>
    </EntryRoot>
  );
};
