import { faExclamationCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import styled from 'styled-components';

import { Score } from '@football/components/collections/Score';

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--double-unit);
  background-color: var(--c-neutral-400);
  gap: var(--half-unit);
  padding: var(--half-unit) var(--intermediate-unit);
  &.listed {
    background: linear-gradient(
        0deg,
        rgba(var(--c-rgb-yellow-300), 0.4) 0%,
        rgba(var(--c-rgb-yellow-300), 0.4) 100%
      ),
      var(--c-static-neutral-700);
  }
`;

type Props = {
  score: number;
  listed?: boolean;
};
const CardScore = ({ score, listed }: Props) => {
  return (
    <Root className={classnames({ listed })}>
      {listed && (
        <FontAwesomeIcon
          color="var(--c-yellow-600)"
          icon={faExclamationCircle}
        />
      )}
      <Score score={score} />
    </Root>
  );
};

export default CardScore;
