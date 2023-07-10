import styled from 'styled-components';

import { Text16 } from '@core/atoms/typography';
import Avatar from '@core/components/user/Avatar';
import UserName from '@core/components/user/UserName';
import { UserHit, convertUserHit } from '@core/lib/algolia';

import Suggestion from '../Suggestion';

type Props = {
  hit: UserHit;
  isHighlighted: boolean;
};

const StyledText16 = styled(Text16)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const UserSuggestion = ({ hit, isHighlighted }: Props) => {
  return (
    <Suggestion
      isHighlighted={isHighlighted}
      avatar={<Avatar user={convertUserHit(hit)} variant="medium" />}
      primary={
        <StyledText16 bold>
          <UserName user={convertUserHit(hit)} />
        </StyledText16>
      }
    />
  );
};
export default UserSuggestion;
