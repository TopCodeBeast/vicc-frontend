import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Checkbox from '@sorare/core/src/atoms/inputs/Checkbox';
import { Text14, Text16 } from '@sorare/core/src/atoms/typography';

import { useMarketplaceEvents } from '@marketplace/lib/events';

import { TokenTransferValidatorProps } from '../../types';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--half-unit);
`;

const ErrorBold = styled.b`
  color: var(--c-red-600);
`;

const Bold = (...chunks: string[]) => {
  return <ErrorBold>{chunks}</ErrorBold>;
};

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
  lineupsCount: number;
};
export const LiveLineupConsentMessage = ({
  value,
  onChange,
  lineupsCount,
  transferContext,
}: Props & Pick<TokenTransferValidatorProps, 'transferContext'>) => {
  const track = useMarketplaceEvents();
  return (
    <Wrapper>
      <Checkbox
        checked={value}
        onChange={e => {
          onChange(e.target.checked);
          track('Toggle Transfer Consent Message', {
            value: e.target.checked,
            transferContext,
          });
        }}
        label={
          <Text16 color="var(--c-neutral-1000)">
            <FormattedMessage
              id="LiveLineupConsentMessage.label"
              defaultMessage="I acknowledge that this action will <b>delete {count, plural, one {the live lineup} other {the live lineups}}</b> featuring {count, plural, one {this card} other {these cards}}"
              values={{
                b: Bold,
                count: lineupsCount,
              }}
            />
          </Text16>
        }
      />
      <Text14 />
    </Wrapper>
  );
};
