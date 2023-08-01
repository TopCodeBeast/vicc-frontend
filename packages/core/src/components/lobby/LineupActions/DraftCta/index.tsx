import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { LineupActionCta } from '../LineupActionCta';

type Props = {
  url: string;
};

export const DraftCta = ({ url }: Props) => {
  return (
    <LineupActionCta color="white" component={Link} to={url}>
      <FormattedMessage id="LobbyLineupActions.Draft" defaultMessage="Draft" />
    </LineupActionCta>
  );
};

export default DraftCta;
