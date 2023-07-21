import { useIntl } from 'react-intl';
import styled from 'styled-components';

import diamond from '@sorare/core/src/assets/animations/diamond.png';

const CostWapper = styled.div`
  display: flex;
  gap: var(--half-unit);
  align-items: center;
`;
const Cost = styled.span`
  font-weight: 700;
  font-size: var(--t-18);
`;

type Props = {
  value: number;
};
const BudgetCost = ({ value }: Props) => {
  const { formatMessage } = useIntl();
  return (
    <CostWapper>
      <img
        src={diamond}
        width={18}
        height={18}
        alt={formatMessage({
          id: 'DraftCard.BudgetCost',
          defaultMessage: 'Budget cost',
        })}
      />
      <Cost>{value}</Cost>
    </CostWapper>
  );
};

export default BudgetCost;
