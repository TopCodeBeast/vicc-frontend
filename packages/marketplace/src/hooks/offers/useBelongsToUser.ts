import { useCurrentUserContext } from '@sorare/core/src/contexts/currentUser';

export default () => {
  const { currentUser } = useCurrentUserContext();

  return ({ sender }: { sender: { __typename: string; slug?: string } }) => {
    return (
      currentUser &&
      sender.__typename === 'User' &&
      currentUser.slug === sender.slug
    );
  };
};
