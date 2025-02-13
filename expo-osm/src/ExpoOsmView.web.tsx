import * as React from 'react';

import { ExpoOsmViewProps } from './ExpoOsm.types';

export default function ExpoOsmView(props: ExpoOsmViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
