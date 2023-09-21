// import { useFlags, useLDClient } from 'launchdarkly-react-client-sdk';
import { useMemo, useState } from 'react';

export interface FlagSet {
  [key: string]: any;
}

export interface User {
  /**
   * A unique string identifying a user.
   *
   * If you omit this property, and also set `anonymous` to `true`, the SDK will generate a UUID string
   * and use that as the key; it will attempt to persist that value in local storage if possible so the
   * next anonymous user will get the same key, but if local storage is unavailable then it will
   * generate a new key each time you specify the user.
   *
   * It is an error to omit the `key` property if `anonymous` is not set.
   */
  key?: string;

  /**
   * An optional secondary key for a user. This affects
   * [feature flag targeting](https://docs.launchdarkly.com/docs/targeting-users#section-targeting-rules-based-on-user-attributes)
   * as follows: if you have chosen to bucket users by a specific attribute, the secondary key (if set)
   * is used to further distinguish between users who are otherwise identical according to that attribute.
   */
  secondary?: string;

  /**
   * The user's name.
   *
   * You can search for users on the User page by name.
   */
  name?: string;

  /**
   * The user's first name.
   */
  firstName?: string;

  /**
   * The user's last name.
   */
  lastName?: string;

  /**
   * The user's email address.
   *
   * If an `avatar` URL is not provided, LaunchDarkly will use Gravatar
   * to try to display an avatar for the user on the Users page.
   */
  email?: string;

  /**
   * An absolute URL to an avatar image for the user.
   */
  avatar?: string;

  /**
   * The user's IP address.
   */
  ip?: string;

  /**
   * The country associated with the user.
   */
  country?: string;

  /**
   * Whether to show the user on the Users page in LaunchDarkly.
   */
  anonymous?: boolean;

  /**
   * Any additional attributes associated with the user.
   */
  custom?: {
    [key: string]: string | boolean | number | Array<string | boolean | number>;
  };

  /**
   * Specifies a list of attribute names (either built-in or custom) which should be
   * marked as private, and not sent to LaunchDarkly in analytics events. This is in
   * addition to any private attributes designated in the global configuration
   * with [[LDOptions.privateAttributeNames]] or [[LDOptions.allAttributesPrivate]].
   */
  privateAttributeNames?: Array<string>;
}

export interface FeatureFlagsContextType {
  flags: FlagSet;
  identify?: (
    user: User,
    hash?: string,
    onDone?: (err: Error | null, flags: FlagSet | null) => void
  ) => Promise<FlagSet>;
}

export default (): FeatureFlagsContextType => {
  const [flags] = useState({}); //useFlags();
  const client = undefined; //useLDClient();

  const computedFlags = useMemo(() => {
    const forcedFlag = sessionStorage.getItem('forcedFlag');
    const forcedFlagObj = forcedFlag ? JSON.parse(forcedFlag) : {};
    return { ...flags, ...forcedFlagObj };
  }, [flags]);

  return {
    flags: computedFlags,
    identify: client?.identify,
  };
};
