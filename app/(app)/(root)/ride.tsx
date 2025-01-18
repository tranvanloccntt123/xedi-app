import { HStack } from "@/src/components/ui/hstack";
import { useRouter } from "expo-router";

const APP_STRUCT = 'RIDE_SCREEN';

import React, { useState, useEffect } from 'react';
import { Box } from '@/src/components/ui/box';
import { Heading } from '@/src/components/ui/heading';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { Input } from '@/src/components/ui/input';
import { InputField } from '@/src/components/ui/input';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/src/store/store';
import FixedRoutesList from '@/src/components/FixedRoutesList';
import { mockFixedRoutes } from '@/src/mockData/fixedRoutes';
import { setFixedRoutes } from '@/src/store/fixedRoutesSlice';
import { Button, ButtonText } from "@/src/components/ui/button";
import AddIcon from "@/src/components/icons/AddIcon";

export default function Ride() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const fixedRoutes = useSelector((state: RootState) => state.fixedRoutes.routes);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load mock data into Redux store
    dispatch(setFixedRoutes(mockFixedRoutes.map(v => ({...v, driverId: user.id}))));
  }, []);

  return (
    <Box className="flex-1 bg-gray-100 py-2">
      <VStack space="md" className="w-full">
        <HStack className="justify-between items-center px-4 mb-2">
          <Heading size="lg">Tuyến cố định</Heading>
          <Button
            size="sm"
            variant="link"
            onPress={() => router.push("/create-fixed-route")}
          >
             <AddIcon size={24} color={'#000000'} />
          </Button>
        </HStack>
        {/* <Heading size="lg" className="mb-1 mx-4">Tuyến cố định</Heading> */}
        <Box className="px-4 mb-4">
          <Input
            variant="outline"
            size="md"
            className="w-full"
          >
            <InputField
              placeholder="Tìm kiếm tuyến đường..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Input>
        </Box>
        <Box className="flex-1 w-full">
          <FixedRoutesList searchQuery={searchQuery} />
        </Box>
      </VStack>
    </Box>
  );
}

