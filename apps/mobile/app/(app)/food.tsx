const APP_STRUCT = 'FOOD_SCREEN';

import React from 'react';
import { Box } from '@/src/components/ui/box';
import { Center } from '@/src/components/ui/center';
import { Heading } from '@/src/components/ui/heading';
import { Text } from '@/src/components/ui/text';

export default function Food() {
  return (
    <Center className="flex-1 bg-gray-100">
      <Box className="items-center">
        <Heading size="2xl" className="mb-4">Order Food</Heading>
        <Text className="text-gray-600">Food ordering functionality coming soon!</Text>
      </Box>
    </Center>
  );
}

