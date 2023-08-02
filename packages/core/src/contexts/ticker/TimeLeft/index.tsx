import { faClock } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { differenceInHours } from 'date-fns';
import { FunctionComponent, ReactNode, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Tooltip from '@core/atoms/tooltip/Tooltip';
import { useIntlContext } from '@core/contexts/intl';
import { useTickerContext } from '@core/contexts/ticker';
import useScreenSize from '@core/hooks/device/useScreenSize';
import { useTimeLeft } from '@core/hooks/useTimeLeft';

export interface LayoutProps {
  children: ReactNode;
}

interface Props {
  time: Date;
  Layout?: FunctionComponent<React.PropsWithChildren<LayoutProps>>;
  endLabel?: string;
  onEnded?: () => void;
  withExplicitTime?: boolean;
  forceInlineLayout?: boolean;
}

const DefaultLayout = ({ children }: LayoutProps) => <div>{children}</div>;

const TimeLeftContainer = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: var(--half-unit);
  white-space: nowrap;
`;

const Icon = styled.span.attrs({
  role: 'img',
})`
  font-size: 0.75em;
  line-height: 1;
`;

const ExplicitTime = ({
  time,
  forceInlineLayout,
}: Pick<Props, 'time' | 'forceInlineLayout'>) => {
  const { up: isTabletOrDesktop } = useScreenSize('tablet');
  const { now } = useTickerContext();
  const hoursDiff = differenceInHours(time, now);
  const { formatDate } = useIntlContext();

  const longTime = formatDate(time, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const inlineLayout = !isTabletOrDesktop || forceInlineLayout;

  if (inlineLayout) {
    const worthDisplayingTime = hoursDiff >= 3 || forceInlineLayout;

    if (worthDisplayingTime) {
      return (
        <>
          {' • '}
          <span>{longTime}</span>
        </>
      );
    }

    return null;
  }

  return (
    <Icon>
      <Tooltip title={longTime} placement="top">
        <FontAwesomeIcon icon={faClock} />
      </Tooltip>
    </Icon>
  );
};

export const TimeLeft = ({
  time,
  Layout = DefaultLayout,
  endLabel,
  onEnded,
  withExplicitTime = false,
  forceInlineLayout = false,
}: Props) => {
  const { isEnded, message } = useTimeLeft(time);

  useEffect(() => {
    if (isEnded && onEnded) onEnded();
  }, [isEnded, onEnded]);

  if (isEnded) {
    if (endLabel) {
      return <span>{endLabel}</span>;
    }
    return <FormattedMessage id="TimeLeft.ended" defaultMessage="Ended" />;
  }

  return (
    <TimeLeftContainer>
      <Layout>
        {withExplicitTime ? (
          <FormattedMessage
            id="TimeLeft.left"
            defaultMessage="{timeleft} left"
            values={{
              timeleft: message,
            }}
          />
        ) : (
          message
        )}
      </Layout>

      {withExplicitTime && (
        <ExplicitTime time={time} forceInlineLayout={forceInlineLayout} />
      )}
    </TimeLeftContainer>
  );
};

export default TimeLeft;
