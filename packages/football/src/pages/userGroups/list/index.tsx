import { Container } from '@sorare/core/src/atoms/container';

import UserGroupsList from '@football/components/userGroup/UserGroupsList';

const UserGroups = ({ showDialog }: { showDialog?: boolean }) => {
  return (
    <Container>
      <UserGroupsList showDialog={showDialog} />
    </Container>
  );
};

export default UserGroups;
