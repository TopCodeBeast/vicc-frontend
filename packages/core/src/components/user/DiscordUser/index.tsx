import { gql } from '@apollo/client';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';

import SocialUser from '../SocialUser';
import { DiscordUser_userProfile } from './__generated__/index.graphql';

type Props = {
  userProfile: DiscordUser_userProfile;
};

const DiscordUser = ({ userProfile: { discordUsername } }: Props) => {
  return <SocialUser nickname={discordUsername} icon={faDiscord} />;
};

DiscordUser.fragments = {
  userProfile: gql`
    fragment DiscordUser_userProfile on UserProfile {
      id
      discordUsername
    }
  `,
};

export default DiscordUser;
