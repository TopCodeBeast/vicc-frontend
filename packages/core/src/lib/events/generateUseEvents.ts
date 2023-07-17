import { useCallback } from 'react';

// import { useEventsContext } from '@core/contexts/events';
// import { getInteractionContext, getSport } from '@core/lib/events';
import { mapKeys } from '@core/lib/object';
import toSnakeCase from '@core/lib/toSnakeCase';
import { sportToJSON } from '@core/protos/events/shared/events';

import { WithOptionalCommonProperties } from './EventsType';

type EventProperties = Record<string, number | string | string[] | boolean>;
const generateUseEvents = <
  EventTypes extends Record<string, EventProperties | void>
>({
  defaultProperties,
}:
  | {
      defaultProperties?: EventProperties;
    }
  | undefined = {}) => {
  return () => {
    // const { track: baseTrack } = useEventsContext();

    const track = useCallback(
      <K extends keyof EventTypes & string>(
        event: K,
        ...rest: EventTypes[K] extends void
          ? []
          : [WithOptionalCommonProperties<EventTypes[K]>]
      ): void => {
        const snakeCasedProperties = rest[0]
          ? mapKeys(rest[0], v => {
              return toSnakeCase(v as string);
            })
          : {};
        // baseTrack(event, {
        //   interaction_context: getInteractionContext(),
        //   sport: sportToJSON(getSport()),
        //   ...defaultProperties,
        //   ...snakeCasedProperties,
        // });
      },
      [/*baseTrack*/]
    );
    return track;
  };
};

export default generateUseEvents;
