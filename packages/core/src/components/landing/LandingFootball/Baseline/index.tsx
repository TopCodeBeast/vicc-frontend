import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { MixedFontTitle } from '../ui';

const Container = styled.div`
  padding: var(--quadruple-unit) var(--unit);
  background-color: var(--c-static-neutral-100);
  color: var(--c-static-neutral-1000);
  &.dark {
    background-color: var(--c-static-neutral-1000);
    color: var(--c-static-neutral-100);
  }
`;

type Props = {
  dark?: boolean;
};
const Baseline = ({ dark }: Props) => {
  return (
    <Container className={classnames({ dark })}>
      <MixedFontTitle>
        <FormattedMessage
          id="Landing.baseline"
          defaultMessage="Explore{br}<span>Other leagues + sports</span>"
          values={{
            br: <br />,
            span: (...chunks: string[]) => {
              return <span>{chunks}</span>;
            },
          }}
        />
      </MixedFontTitle>
    </Container>
  );
};
export default Baseline;
