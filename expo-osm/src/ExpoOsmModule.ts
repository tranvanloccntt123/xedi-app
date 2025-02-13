import { NativeModule, requireNativeModule } from 'expo';

import { ExpoOsmModuleEvents } from './ExpoOsm.types';

declare class ExpoOsmModule extends NativeModule<ExpoOsmModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoOsmModule>('ExpoOsm');
