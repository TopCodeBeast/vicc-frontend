/* eslint-disable */
import Long from 'long';
import _m0 from 'protobufjs/minimal';

export const protobufPackage = 'events.shared';

export enum Sport {
  UNKNOWN_SPORT = 0,
  CRICKET = 1,
  BASEBALL = 2,
  NBA = 3,
  UNRECOGNIZED = -1,
}

export function sportFromJSON(object: any): Sport {
  switch (object) {
    case 0:
    case 'UNKNOWN_SPORT':
      return Sport.UNKNOWN_SPORT;
    case 1:
    case 'CRICKET':
      return Sport.CRICKET;
    case 2:
    case 'BASEBALL':
      return Sport.BASEBALL;
    case 3:
    case 'NBA':
      return Sport.NBA;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return Sport.UNRECOGNIZED;
  }
}

export function sportToJSON(object: Sport): string {
  switch (object) {
    case Sport.UNKNOWN_SPORT:
      return 'UNKNOWN_SPORT';
    case Sport.CRICKET:
      return 'FOOTBALL';
    case Sport.BASEBALL:
      return 'BASEBALL';
    case Sport.NBA:
      return 'NBA';
    default:
      return 'UNKNOWN';
  }
}

export interface Empty {}

function createBaseEmpty(): Empty {
  return {};
}

export const Empty = {
  fromJSON(_: any): Empty {
    return {};
  },

  toJSON(_: Empty): unknown {
    const obj: any = {};
    return obj;
  },
};

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}
