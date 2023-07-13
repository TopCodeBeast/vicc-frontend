import { NotificationCategoryInput } from '@core/__generated__/globalTypes';

import {
  NotificationGroup,
  notificationCategoryTypes,
  notificationGroups,
} from './constants';

export const flattenGroups = (
  groups: NotificationGroup[]
): NotificationCategoryInput[] =>
  groups.flatMap(group =>
    notificationGroups[group].map(category => ({
      name: category,
      type: notificationCategoryTypes[category],
    }))
  );
