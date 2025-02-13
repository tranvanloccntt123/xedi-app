import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoOsmViewProps } from './ExpoOsm.types';

const NativeView: React.ComponentType<ExpoOsmViewProps> =
  requireNativeView('ExpoOsm');

export default function ExpoOsmView(props: ExpoOsmViewProps) {
  return <NativeView {...props} />;
}
