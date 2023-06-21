import { CurrentUserQuery } from './__generated__/queries.graphql';

export type CurrentUserQuery_currentUser = Exclude<CurrentUserQuery['currentUser'], null | undefined>;
export type CurrentUserQuery_currentUser_userSettings = CurrentUserQuery_currentUser['userSettings']
