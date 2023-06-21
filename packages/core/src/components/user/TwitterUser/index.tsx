import { gql } from '@apollo/client';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import styled from 'styled-components';

import SocialUser from '@core/components/user/SocialUser';

import { TwitterUser_userProfile } from './__generated__/index.graphql';

const Root = styled.a`
  color: inherit;
  &:hover {
    color: inherit;
    text-decoration: underline;
  }
`;
type Props = {
  userProfile: TwitterUser_userProfile;
};
const TwitterUser = ({ userProfile: { twitterUsername } }: Props) => {
  if (!twitterUsername) return null;

  return (
    <Root
      href={`https://twitter.com/${twitterUsername}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      <SocialUser nickname={twitterUsername} icon={faTwitter} prefix="@" />
    </Root>
  );
};

TwitterUser.fragments = {
  userProfile: gql`
    fragment TwitterUser_userProfile on UserProfile {
      id
      twitterUsername
    }
  `,
};

export default TwitterUser;
