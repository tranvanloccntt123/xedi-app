const APP_STRUCT = 'RIDE_SCREEN';

import React, { useState, useEffect } from 'react';
import { Box } from '@/src/components/ui/box';
import { Heading } from '@/src/components/ui/heading';
import { Text } from '@/src/components/ui/text';
import { VStack } from '@/src/components/ui/vstack';
import { Input } from '@/src/components/ui/input';
import { InputField } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { ButtonText } from '@/src/components/ui/button';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/src/store/store';
import FixedRoutesList from '@/src/components/FixedRoutesList';
import { router } from 'expo-router';
import { mockFixedRoutes } from '@/src/mockData/fixedRoutes';
import { setFixedRoutes } from '@/src/store/fixedRoutesSlice';
import { Platform, ScrollView } from 'react-native';

export default function Ride() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const fixedRoutes = useSelector((state: RootState) => state.fixedRoutes.routes);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load mock data into Redux store
    dispatch(setFixedRoutes(mockFixedRoutes.map(v => ({...v, driverId: user.id}))));
  }, []);

  const openAddModal = () => {
    router.navigate('create-fixed-route');
  };

  const userFixedRoutes = fixedRoutes.filter(route => route.driverId === user?.id);

  return (
    <Box className="flex-1 bg-gray-100">
      <ScrollView
        style={{ flex: 1, width: '100%' }}
        showsVerticalScrollIndicator={Platform.OS === "web"}
        contentContainerStyle={{ width: '100%' }}
      >
        <VStack space="md" className="w-full p-4">
          <Heading size="2xl" className="mb-4">Quản lý chuyến đi</Heading>
          
          {user?.role === 'driver' ? (
            <>
              <Input
                variant="outline"
                size="md"
                className="w-full mb-4"
              >
                <InputField
                  placeholder="Tìm kiếm tuyến đường..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </Input>

              {userFixedRoutes.length > 0 ? (
                <Box className="w-full mb-4">
                  <FixedRoutesList searchQuery={searchQuery} />
                </Box>
              ) : (
                <Button
                  size="lg"
                  className="w-full mb-4 bg-blue-500"
                  onPress={openAddModal}
                >
                  <ButtonText className="text-white">Thêm tuyến cố định</ButtonText>
                </Button>
              )}
            </>
          ) : (
            <Text className="text-gray-600">Chức năng đặt xe sẽ sớm ra mắt!</Text>
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
}

