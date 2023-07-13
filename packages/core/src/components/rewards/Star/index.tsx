import { faStar } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

// TODO: replace this component with `ResponsiveStar` (jgirault)
export const Star = styled(FontAwesomeIcon).attrs({ icon: faStar })`
  background: linear-gradient(
    27.65deg,
    var(--c-static-reward-900) 21.95%,
    var(--c-static-reward-200) 109.77%
  );
  color: white;
  border-radius: 1em;
  text-align: center;
`;

const Wrapper = styled.div`
  background: linear-gradient(
    27.65deg,
    var(--c-static-reward-900) 21.95%,
    var(--c-static-reward-200) 109.77%
  );
  color: white;
  aspect-ratio: 1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  width: 1em;
  line-height: 1.5em;

  svg {
    font-size: 0.5em;
  }
`;

export const ResponsiveStar = () => {
  return (
    <Wrapper>
      <FontAwesomeIcon icon={faStar} />
    </Wrapper>
  );
};
