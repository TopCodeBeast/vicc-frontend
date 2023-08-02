import { faXmark } from '@fortawesome/pro-solid-svg-icons';
import { FC, ReactNode } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import IconButton from '@sorare/core/src/atoms/buttons/IconButton';
import { glossary } from '@sorare/core/src/lib/glossary';
import { tabletAndAbove } from '@sorare/core/src/style/mediaQuery';

const Root = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--double-unit);
  width: 100%;
  padding: var(--double-unit);
`;

const Extra = styled.div`
  display: flex;
  gap: var(--unit);
  > * {
    background: var(--c-neutral-900);
    border-radius: 2em;
    padding: var(--half-unit);
    @media ${tabletAndAbove} {
      padding: var(--half-unit) var(--double-unit);
    }
  }
`;

type Props = {
  Back: FC<React.PropsWithChildren<unknown>>;
  renderExtra?: (props: FC<React.PropsWithChildren<unknown>>) => ReactNode;
};
const LineupHeader = ({ Back, renderExtra }: Props) => {
  const { formatMessage } = useIntl();
  return (
    <Root>
      {renderExtra?.(Extra)}
      <Back>
        <IconButton
          component="span"
          icon={faXmark}
          color="transparent"
          aria-label={formatMessage(glossary.close)}
        />
      </Back>
    </Root>
  );
};

export default LineupHeader;
