import { useIntl } from 'react-intl';

import TextDocument from '@sorare/core/src/routing/TextDocument';

const GameRules = () => {
  const { formatMessage } = useIntl();
  return (
    <div dir="ltr">
      <TextDocument
        escapeHtml={false}
        document={formatMessage({
          id: 'GameRules.path',
          defaultMessage: 'GAME_RULES.md',
        })}
      />
    </div>
  );
};

export default GameRules;
