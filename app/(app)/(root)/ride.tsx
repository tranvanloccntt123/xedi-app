const APP_STRUCT = 'RIDE_SCREEN';

import React from 'react';
import { Box } from '@/src/components/ui/box';
import { Center } from '@/src/components/ui/center';
import { Heading } from '@/src/components/ui/heading';
import { Text } from '@/src/components/ui/text';

export default function Ride() {
  return (
    <Center className="flex-1 bg-gray-100">
      <Box className="items-center">
        <Heading size="2xl" className="mb-4">Book a Ride</Heading>
        <Text className="text-gray-600">Ride booking functionality coming soon!</Text>
      </Box>
    </Center>
  );
}

