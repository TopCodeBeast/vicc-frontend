import { faCaretLeft } from '@fortawesome/pro-solid-svg-icons';
import { useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { glossary } from '@core/lib/glossary';

import IconButton from '../IconButton';

type OnClickGoto = { to: string; onClick?: never };
type OnClickDo = { to?: never; onClick: () => void };
type OnClickGoBackInHistory = { to?: never; onClick?: never };

export type Props = OnClickGoto | OnClickDo | OnClickGoBackInHistory;

const buttonProps = (
  to: string | undefined,
  onClick: (() => void) | undefined
) => (to ? { to, component: Link } : { onClick });

export const BackButton = ({ to, onClick }: Props) => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <IconButton
      color="white"
      icon={faCaretLeft}
      aria-label={formatMessage(glossary.back)}
      {...buttonProps(to, onClick || goBack)}
    />
  );
};

export default BackButton;
