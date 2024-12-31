import React, { useState } from 'react';
import { Box } from '@/src/components/ui/box';
import { Button } from '@/src/components/ui/button';
import { ButtonText } from '@/src/components/ui/button';
import { Heading } from '@/src/components/ui/heading';
import { VStack } from '@/src/components/ui/vstack';
import { Input } from '@/src/components/ui/input';
import { InputField } from '@/src/components/ui/input';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import FixedRoutesList from '@/src/components/FixedRoutesList';
import TripRequestList from '@/src/components/TripRequestList';
import AddFixedRouteModal from '@/src/components/AddFixedRouteModal';

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);
  const fixedRoutes = useSelector((state: RootState) => state.fixedRoutes.routes);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const openAddModal = () => {
    setIsAddModalVisible(true);
  };

  const closeAddModal = () => {
    setIsAddModalVisible(false);
  };

  const userFixedRoutes = fixedRoutes.filter(route => route.driverId === user?.id);

  return (
    <Box className="flex-1 bg-gray-100 p-4">
      <VStack space="md">
        <Heading size="2xl" className="mb-4">Welcome to Xedi</Heading>
        <Heading size="lg" className="mb-6">Phone: {user?.phone}</Heading>
        
        {user?.role === 'driver' && (
          <>
            <Input
              variant="outline"
              size="md"
              className="w-full max-w-md mb-4"
            >
              <InputField
                placeholder="Search routes..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </Input>

            {userFixedRoutes.length > 0 ? (
              <Box className="w-full max-w-md mb-4">
                <FixedRoutesList searchQuery={searchQuery} />
              </Box>
            ) : (
              <Button size="lg" className="w-64 mb-4 bg-blue-500" onPress={openAddModal}>
                <ButtonText className="text-white">Thêm tuyến cố định</ButtonText>
              </Button>
            )}

            <AddFixedRouteModal isVisible={isAddModalVisible} onClose={closeAddModal} />

            <Box className="w-full max-w-md mb-4">
              <TripRequestList />
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
}

