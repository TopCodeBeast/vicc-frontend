import { isBefore, isValid, parseISO } from 'date-fns';
import { FormattedMessage, defineMessages } from 'react-intl';

import { GenericBanner, Icon } from '@core/components/cardswap/GenericBanner';
import { useTickerContext } from '@core/contexts/ticker';

import cardDropIcon from './assets/card_drop_icon.svg';

export type Props = {
  nextDropAvailable: string;
  onClick: () => void;
  className?: string;
};

const messages = defineMessages({
  timeLeft: {
    id: 'CardDrop.TimeUntilNext.timeLeft',
    defaultMessage: 'Next drop in {timeLeft}',
  },
});

export const CardDropBanner = ({
  nextDropAvailable,
  onClick,
  className,
}: Props) => {
  const { now } = useTickerContext();
  const nextDropAvailableDate = parseISO(nextDropAvailable);

  if (!isValid(nextDropAvailableDate)) return null;

  const isDropAvailable = isBefore(nextDropAvailableDate, now);

  return (
    <GenericBanner
      title={
        <FormattedMessage
          id="CardDrop.Banner.title"
          defaultMessage="Daily drop"
        />
      }
      subtitle={
        <FormattedMessage
          id="CardDrop.Banner.explanation"
          defaultMessage="Get a free Common Card each day to help you build your team!"
        />
      }
      cta={
        <FormattedMessage
          id="CardDrop.Banner.cta"
          defaultMessage="Get your free Card"
        />
      }
      timeLeftMessage={messages.timeLeft}
      isAvailable={isDropAvailable}
      nextAvailableDate={nextDropAvailableDate}
      icon={<Icon src={cardDropIcon} alt="" />}
      onClick={onClick}
      className={className}
    />
  );
};
