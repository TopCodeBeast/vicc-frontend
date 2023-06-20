import fingerprintJS from '@fingerprintjs/fingerprintjs';
import { ReactNode, useCallback, useEffect, useState } from 'react';

import { Deferred } from '@sorare/wallet-shared';
import { DEVICE_FINGERPRINT_KEY } from '@sorare/core/src/constants/intl';
import useLocalStorage from '@sorare/core/src/hooks/useLocalStorage';

import Provider from '.';

interface Props {
  children: ReactNode;
}

const computeDeviceFingerprint = async () => {
  const fp = await fingerprintJS.load();
  const fpResult = await fp.get();

  // https://github.com/fingerprintjs/fingerprintjs/blob/master/docs/extending.md#extending-fingerprintjs
  /* eslint-disable @typescript-eslint/no-unused-vars */
  // as of March 2, remove the `audio`, `screenResolution` & `screenFrame` sources
  // to avoid depending on external monitors or headphones
  const { audio, screenResolution, screenFrame, ...componentsMarch2nd } =
    fpResult.components;

  // as of March 4, remove the `deviceMemory`, `hardwareConcurrency`, `domBlockers`, `canvas` and `plugins`
  // sources to be compliant with Privacy-first browsers like Brave randomizing those
  // as well as `colorDepth`, `forcedColors`, `contrast`, `reducedMotion` and `hdr`
  // which could end up being different depending on screens
  const {
    canvas,
    plugins,
    domBlockers,
    colorDepth,
    forcedColors,
    contrast,
    reducedMotion,
    hdr,
    hardwareConcurrency,
    deviceMemory,
    ...componentsMarch4th
  } = componentsMarch2nd;
  /* eslint-enable @typescript-eslint/no-unused-vars */

  return [
    fingerprintJS.hashComponents({ ...componentsMarch2nd }),
    fingerprintJS.hashComponents({ ...componentsMarch4th }),
  ].join(',');
};

const deferredStateFactory = () => new Deferred<string>();

const DeviceFingerPrintProvider = ({ children }: Props) => {
  const [deferred] = useState(deferredStateFactory);
  const [localStorageDeviceFingerprint, setLocalStorageDeviceFingerprint] =
    useLocalStorage<string | undefined>(DEVICE_FINGERPRINT_KEY, undefined);

  useEffect(() => {
    if (!deferred.pending) {
      return () => {};
    }
    if (localStorageDeviceFingerprint) {
      deferred.resolve(localStorageDeviceFingerprint);
      return () => {};
    }
    let cancelled = false;
    computeDeviceFingerprint()
      .then(deviceFingerPrint => {
        if (!cancelled) {
          setLocalStorageDeviceFingerprint(deviceFingerPrint);
        }
        return deviceFingerPrint;
      })
      .then(
        deviceFingerPrint => {
          if (deferred.pending) {
            deferred.resolve(deviceFingerPrint);
          }
        },
        error => deferred.reject(error)
      );
    return () => {
      cancelled = true;
    };
  }, [
    localStorageDeviceFingerprint,
    deferred,
    setLocalStorageDeviceFingerprint,
  ]);

  const deviceFingerprint = useCallback(
    async () => deferred.promise,
    [deferred]
  );

  return <Provider value={{ deviceFingerprint }}>{children}</Provider>;
};

export default DeviceFingerPrintProvider;
