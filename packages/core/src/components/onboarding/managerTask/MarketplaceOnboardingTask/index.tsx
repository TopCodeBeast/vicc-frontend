import { ReactNode } from 'react';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
} from 'react-intl';
import styled from 'styled-components';

import Button from '@sorare/core/src/atoms/buttons/Button';
import { Text14, Title4 } from '@sorare/core/src/atoms/typography';
import { MarketplaceOnboardingStep } from 'contexts/managerTask';
import { glossary } from '@sorare/core/src/lib/glossary';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--unit);
`;

const marketplaceTaskTitles = defineMessages<MarketplaceOnboardingStep>({
  [MarketplaceOnboardingStep.menu]: {
    id: 'MarketplaceTaskTitles.menu',
    defaultMessage: 'Access the Market',
  },
  [MarketplaceOnboardingStep.managerSalesLink]: {
    id: 'MarketplaceTaskTitles.managerSalesLink',
    defaultMessage: 'Access Manager Sales',
  },
  [MarketplaceOnboardingStep.search]: {
    id: 'MarketplaceTaskTitles.search',
    defaultMessage: 'Search for a player',
  },
  [MarketplaceOnboardingStep.marketplaceItem]: {
    id: 'MarketplaceTaskTitles.marketplaceItem',
    defaultMessage: 'Cards are worth money',
  },
  [MarketplaceOnboardingStep.buy]: {
    id: 'MarketplaceTaskTitles.buy',
    defaultMessage: 'Buy your card',
  },
});

export const marketplaceTaskDescription =
  defineMessages<MarketplaceOnboardingStep>({
    [MarketplaceOnboardingStep.menu]: {
      id: 'MarketplaceTaskDescription.menu',
      defaultMessage:
        'You can recruit new players on the Sorare Market, accessible from the menu.',
    },
    [MarketplaceOnboardingStep.managerSalesLink]: {
      id: 'MarketplaceTaskDescription.managerSalesLink',
      defaultMessage:
        'The best way to get started is to buy cards from other Sorare Managers.',
    },
    [MarketplaceOnboardingStep.search]: {
      id: 'MarketplaceTaskDescription.search',
      defaultMessage:
        'There are thousands of players licensed on Sorare. You can search for a player using the search bar.',
    },
    [MarketplaceOnboardingStep.marketplaceItem]: {
      id: 'MarketplaceTaskDescription.marketplaceItem',
      defaultMessage:
        "{playerName}'s {rarity} is currently available at {price}.",
    },
    [MarketplaceOnboardingStep.buy]: {
      id: 'MarketplaceTaskDescription.buy',
      defaultMessage:
        'Once you decided which player you want to recruit for your team, you can buy the card here.',
    },
  });

const MarketplaceOnboardingTask = ({
  name,
  title = marketplaceTaskTitles[name],
  buttonLabel = glossary.continue,
  content = (
    <Text14 color="var(--c-neutral-500)">
      <FormattedMessage {...marketplaceTaskDescription[name]} />
    </Text14>
  ),
  onClick,
}: {
  title?: MessageDescriptor;
  name: MarketplaceOnboardingStep;
  content?: ReactNode;
  buttonLabel?: MessageDescriptor;
  onClick: () => void;
}) => {
  return (
    <Content>
      <Title4>
        <FormattedMessage {...title} />
      </Title4>
      {content}
      <Footer>
        <Text14 color="var(--c-neutral-500)">
          <FormattedMessage
            id="TooltipContent.steps"
            values={{
              value:
                Object.keys(MarketplaceOnboardingStep).findIndex(
                  key => key === name
                ) + 1,
              total: 5,
            }}
            defaultMessage="{value} of {total}"
          />
        </Text14>
        <Button small color="blue" onClick={onClick}>
          <FormattedMessage {...buttonLabel} />
        </Button>
      </Footer>
    </Content>
  );
};

export default MarketplaceOnboardingTask;
