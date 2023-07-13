import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { animated, useTransition } from '@react-spring/web';
import styled from 'styled-components';

import useCopyToClipboard from '@core/hooks/useCopyToClipboard';

const CopyButtonContainer = styled.div`
  position: relative;
`;
const CopyButton = styled(animated.button)<{ $alignRight?: boolean }>`
  position: absolute;
  cursor: pointer;
  color: var(--c-brand-600);
  font-weight: bold;
  white-space: nowrap;
  margin: auto;
  top: 0;
  bottom: 0;
  ${({ $alignRight }) => ($alignRight ? 'right: 0;' : 'left: 0')}
`;
type Props = { textToCopy: string; alignRight?: boolean; onClick?: () => void };
const CopyToClipboardButton = ({ textToCopy, alignRight, onClick }: Props) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = useCopyToClipboard();
  const transition = useTransition(copied, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const onCopy = () => {
    copyToClipboard(textToCopy, () => {
      setCopied(true);
    });
    if (onClick) onClick();
  };

  useEffect(() => {
    if (!copied) return () => {};
    const timer = setTimeout(() => setCopied(false), 1000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <CopyButtonContainer>
      {transition((styles, isCopied) => (
        <CopyButton style={styles} $alignRight={alignRight} onClick={onCopy}>
          {isCopied ? (
            <FormattedMessage
              id="Atoms.Buttons.CopyToClipboardButton.copiedMessage"
              defaultMessage="Copied !"
            />
          ) : (
            <FormattedMessage
              id="Atoms.Buttons.CopyToClipboardButton.copyLink"
              defaultMessage="Copy"
            />
          )}
        </CopyButton>
      ))}
    </CopyButtonContainer>
  );
};

export default CopyToClipboardButton;
