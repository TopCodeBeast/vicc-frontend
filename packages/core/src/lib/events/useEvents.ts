import { useCallback } from 'react';

const useEvents = () => {
  const track = useCallback((msg: any, ...params: any): void => {
      /*if (Object.prototype.hasOwnProperty.call(protosEvents, event)) {
        baseTrack(event, {
          interaction_context: getInteractionContext(),
          ...(rest[0] &&
            // if it's a protobuf event, let's use its generated transformation function
            // which transform keys to snake case & rounds numbers
            // @ts-expect-error unresolved key issue
            protosEvents[event](rest[0])),
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
      });*/
    },
    []
  );

  return track;
};

export default useEvents;
