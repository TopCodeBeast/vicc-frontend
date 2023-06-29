import { ReactNode } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
import styled, { css } from 'styled-components';

import Accordion from '@core/atoms/layout/Accordion';
import { Text14, Title6 } from '@core/atoms/typography';
import { useIntlContext } from '@core/contexts/intl';

export interface Props {
  title: string | ReactNode;
  date: string;
  state?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  amount: ReactNode;
  icon?: ReactNode;
  expandable?: boolean;
}

export const messages = defineMessages({
  offerTitleAsReceiver: {
    id: 'TransactionsHistoryOffer.titleAsReceiver',
    defaultMessage: 'Sale from {otherParty}',
  },
  offerTitleAsSender: {
    id: 'TransactionsHistoryOffer.titleAsSender',
    defaultMessage: 'Sale to {otherParty}',
  },
});

const Infos = styled.div`
  display: flex;
  gap: var(--unit);
  flex-direction: column;
  color: var(--c-neutral-600);
`;

const Header = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  text-align: left;
`;

const NotExpandableBlock = styled.div<{ rightPadding?: boolean }>`
  --collapse-icon-width: 14px;
  --gap: var(--double-unit);
  --right-padding: calc(var(--gap) + var(--collapse-icon-width));

  display: flex;
  justify-content: space-between;
  padding: var(--intermediate-unit) 0;
  border-bottom: 1px solid var(--c-neutral-200);

  ${({ rightPadding }) =>
    rightPadding
      ? css`
          padding-right: var(--right-padding);
        `
      : null};
`;

const Block = styled.div`
  display: flex;
  gap: var(--unit);
  align-items: flex-end;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Children = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ChildrenContent = styled.div`
  width: 100%;
  border-left: 5px solid var(--c-neutral-400);
  padding-left: var(--double-unit);
`;

export const TransactionEntry = ({
  title,
  date,
  amount,
  state,
  children,
  action,
  icon,
  expandable = true,
}: Props) => {
  const { formatDate, formatTime } = useIntlContext();

  const renderHeader = () => (
    <Header>
      <Block>
        {icon}
        <Content>
          {title && <Title6>{title}</Title6>}
          <Infos>
            <Text14>
              <FormattedMessage
                id="TransactionEntry.date"
                defaultMessage="{date} at {time}"
                values={{
                  date: formatDate(date, {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }),
                  time: formatTime(date),
                }}
              />
            </Text14>
            {state}
          </Infos>
        </Content>
      </Block>
      {amount}
    </Header>
  );

  const renderChildren = () => (
    <Children>
      <ChildrenContent>{children}</ChildrenContent>
      {action}
    </Children>
  );

  return (
    <>
      {(children || action) && expandable ? (
        <Accordion noHorizontalPadding title={renderHeader()}>
          {renderChildren()}
        </Accordion>
      ) : (
        <NotExpandableBlock rightPadding={expandable}>
          {renderHeader()}
        </NotExpandableBlock>
      )}
    </>
  );
};
