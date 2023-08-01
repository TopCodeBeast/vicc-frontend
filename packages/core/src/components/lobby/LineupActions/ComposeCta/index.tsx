import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { LineupActionCta } from '../LineupActionCta';

type Props = {
  onTrack?: () => void;
  url: string;
};

export const ComposeCta = ({ onTrack, url }: Props) => {
  return (
    <LineupActionCta color="blue" component={Link} to={url} onClick={onTrack}>
      <FormattedMessage
        id="LobbyLineupActions.Register"
        defaultMessage="Register"
      />
    </LineupActionCta>
  );
};

export default ComposeCta;
