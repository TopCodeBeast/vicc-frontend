import { faExclamationCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import styled from 'styled-components';

import { Score } from '@core/components/collections/Score';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--half-unit);
  padding: var(--half-unit) var(--intermediate-unit);
  color: var(--c-static-neutral-100);
  background-color: var(--c-static-neutral-700);
  border-radius: var(--double-unit);
  transition: background-color 0.1s ease-in-out;
  &.listed {
    background: linear-gradient(
        0deg,
        rgba(var(--c-rgb-yellow-300), 0.4) 0%,
        rgba(var(--c-rgb-yellow-300), 0.4) 100%
      ),
      var(--c-static-neutral-700);
  }
`;

const ScoreButton = styled.button`
  &:hover,
  &:focus {
    ${Wrapper} {
      background-color: var(--c-static-neutral-600);
      box-shadow: var(--shadow-300);
    }
  }
`;

type Props = {
  score: number;
  listed?: boolean;
  onClick?: (() => void) | false;
};

const Content = ({ score, listed }: Props) => {
  return (
    <Wrapper className={classnames({ listed })}>
      {listed && (
        <FontAwesomeIcon
          color="var(--c-yellow-600)"
          icon={faExclamationCircle}
        />
      )}
      <Score score={score} />
    </Wrapper>
  );
};

export const CardScore = (props: Props) => {
  const { onClick } = props;
  if (onClick)
    return (
      <ScoreButton onClick={onClick}>
        <Content {...props} />
      </ScoreButton>
    );
  return <Content {...props} />;
};
