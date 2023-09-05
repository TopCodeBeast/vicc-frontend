import { REVISION, VERSION } from '../config';

// YYYYMMDDhhmmss
const version_format =
  /(?<year>\d{4})(?<month>\d{2})(?<day>\d{2})(?<hour>\d{2})(?<minute>\d{2})(?<second>\d{2})/;

export const parseVersion = (version: string): Date | null => {
  const result = version_format.exec(version.toString());
  if (result !== null) {
    const {
      groups: { year, month, day, hour, minute, second },
    } = result as unknown as {
      groups: {
        year: string;
        month: string;
        day: string;
        hour: string;
        minute: string;
        second: string;
      };
    };

    return new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      parseInt(hour, 10),
      parseInt(minute, 10),
      parseInt(second, 10)
    );
  }
  return null;
};

export function logVersion() {
  /* eslint-disable  no-console */
  console.log('%cVicc', 'font-size: large');

  const date = parseVersion(VERSION.toString());
  if (date !== null) {
    console.log(`%c${VERSION} – ${date}`, 'color: grey; font-size: small');
  }
  console.log(`%c${REVISION}`, 'color: grey; font-size: x-small');
  /* eslint-enable  no-console */
}
