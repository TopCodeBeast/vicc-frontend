import { createContext, useContext } from 'react';

export interface DeviceFingerprintContext {
  deviceFingerprint: () => Promise<string>;
}

export const deviceFingerprintContext =
  createContext<DeviceFingerprintContext | null>(null);

export const useDeviceFingerprintContext = () =>
  useContext(deviceFingerprintContext)!;

export default deviceFingerprintContext.Provider;
