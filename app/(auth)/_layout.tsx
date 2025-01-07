const APP_STRUCT = 'AUTH_LAYOUT';

import React from 'react';
import { Slot } from 'expo-router';
import { Box } from '@/src/components/ui/box';

export default function AuthLayout() {
  return (
    <Box className="flex-1">
      <Slot />
    </Box>
  );
}

