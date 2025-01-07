const APP_STRUCT = 'APP_LAYOUT';

import React from 'react';
import { Slot } from 'expo-router';
import { Box } from '@/src/components/ui/box';

export default function AppLayout() {
  return (
    <Box className="flex-1">
      <Slot />
    </Box>
  );
}

