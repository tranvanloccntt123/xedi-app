import { registerWebModule, NativeModule } from 'expo';

import { ExpoOsmModuleEvents } from './ExpoOsm.types';

class ExpoOsmModule extends NativeModule<ExpoOsmModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoOsmModule);
