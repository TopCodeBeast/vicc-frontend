import { useCallback } from 'react';

import { useEventsContext } from 'contexts/events';
import { getInteractionContext, getSport } from '@sorare/core/src/lib/events';
import { mapKeys } from '@sorare/core/src/lib/object';
import toStartCase from '@sorare/core/src/lib/string/toStartCase';
import toSnakeCase from '@sorare/core/src/lib/toSnakeCase';
import * as platformEvents from 'protos/events/platform/web/events';
import { sportToJSON } from 'protos/events/shared/events';
import * as so5Events from 'protos/events/so5/web/events';
import { StartCase, StringKeysOf } from 'types';

import { EventsType, WithOptionalCommonProperties } from './EventsType';

type ObjectWithToJSON = { toJSON: (args: any) => any };

type PropertiesWithToJSON<T extends Record<string, any>> = {
  [P in StringKeysOf<T> as T[P] extends ObjectWithToJSON
    ? StartCase<P>
    : never]: T[P];
};

const getTypedProtosEvents = <T extends Record<string, any>>(
  protosEvents: T
): PropertiesWithToJSON<T> => {
  const protoEventKeys = Object.keys(protosEvents) as StringKeysOf<
    typeof protosEvents
  >[];
  return protoEventKeys.reduce<PropertiesWithToJSON<T>>((acc, cur) => {
    const currentValue = protosEvents[cur];
    if (Object.prototype.hasOwnProperty.call(currentValue, 'toJSON')) {
      // @ts-expect-error hasOwnProperty is not helpful to narrow the type of cur down
      acc[toStartCase(cur)] = currentValue.toJSON;
    }
    return acc;
  }, {} as PropertiesWithToJSON<T>);
};

export const protosEvents = {
  ...getTypedProtosEvents(so5Events),
  ...getTypedProtosEvents(platformEvents),
};

type ProtoEventTypes = typeof protosEvents;
type ProtoTrackEventTypes = {
  [key in keyof ProtoEventTypes]: WithOptionalCommonProperties<
    Parameters<ProtoEventTypes[key]['toJSON']>[0]
  >;
};

export type AggregatedTrackEvents = EventsType & ProtoTrackEventTypes;

const useEvents = () => {
  const { track: baseTrack } = useEventsContext();

  const track = useCallback(
    <K extends keyof AggregatedTrackEvents>(
      event: K,
      ...rest: AggregatedTrackEvents[K] extends undefined
        ? []
        : [AggregatedTrackEvents[K]]
    ): void => {
      if (Object.prototype.hasOwnProperty.call(protosEvents, event)) {
        baseTrack(event, {
          interaction_context: getInteractionContext(),
          ...(rest[0] &&
            // if it's a protobuf event, let's use its generated transformation function
            // which transform keys to snake case & rounds numbers
            // @ts-expect-error unresolved key issue
            protosEvents[event](rest[0])),
          // @ts-expect-error unresolved key issue
          sport: rest[0]?.sport || sportToJSON(getSport()),
        });
        return;
      }

      const snakeCaseProperties = rest[0]
        ? mapKeys(rest[0], v => {
            return toSnakeCase(v as string);
          })
        : {};

      baseTrack(event as string, {
        interaction_context: getInteractionContext(),
        sport: sportToJSON(getSport()),
        ...snakeCaseProperties,
      });
    },
    [baseTrack]
  );

  return track;
};

export default useEvents;
