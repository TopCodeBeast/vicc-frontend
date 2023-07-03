import { FC } from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import styled from 'styled-components';

import { Title4 } from '@core/atoms/typography';
import TooltipFooter from '@core/components/onboarding/managerTask/TooltipFooter';
import { glossary } from '@core/lib/glossary';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--unit);
`;

const ManagerTaskContainer: FC<{
  labels: {
    title: MessageDescriptor;
    button?: MessageDescriptor;
  };
  current: number;
  total: number;
  onClick: () => void;
}> = ({ labels, children, current, total, onClick }) => {
  return (
    <Content>
      <Title4>
        <FormattedMessage {...labels.title} />
      </Title4>
      {children}
      <TooltipFooter
        value={current}
        total={total}
        onClick={onClick}
        buttonLabel={labels.button || glossary.continue}
      />
    </Content>
  );
};

export default ManagerTaskContainer;
