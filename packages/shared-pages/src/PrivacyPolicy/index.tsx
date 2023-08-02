import { useIntl } from 'react-intl';

import TextDocument from '@sorare/core/src/routing/TextDocument';

const PrivacyPolicy = () => {
  const { formatMessage } = useIntl();
  return (
    <div dir="ltr">
      <TextDocument
        document={formatMessage({
          id: 'PrivacyPolicy.path',
          defaultMessage: 'PRIVACY_POLICY.md',
        })}
      />
    </div>
  );
};

export default PrivacyPolicy;
