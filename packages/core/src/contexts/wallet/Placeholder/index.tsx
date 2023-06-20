import { CSSProperties, useLayoutEffect, useState } from 'react';

import { useWalletContext } from '..';

interface Props {
  className?: string;
  withoutHeader?: boolean;
  style?: CSSProperties;
}

export const Placeholder = ({ className, style, withoutHeader }: Props) => {
  const { walletNode, setWalletNode } = useWalletContext();
  const [previousStyle, updatePreviousStyle] = useState(style);

  useLayoutEffect(() => {
    if (previousStyle !== style) {
      updatePreviousStyle(style);
      if (walletNode) {
        walletNode.dispatchEvent(new Event('styleChanged', { bubbles: false }));
      }
    }
  }, [previousStyle, style, walletNode]);

  const effectiveStyle = !withoutHeader
    ? style
    : { ...style, '--header-size': 0 };

  return (
    <div ref={setWalletNode} className={className} style={effectiveStyle} />
  );
};

export default Placeholder;
