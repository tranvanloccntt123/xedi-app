import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useRealm } from '@/src/hooks/useRealm';
import { User } from '@/src/models/RealmModels';
import { Button, Input, Text, VStack, Select, SelectTrigger, SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectItem } from '@gluestack-ui/themed';

export function UserProfileScreen({ route }) {
  const realm = useRealm();
  const [user, setUser] = useState<User | null>(null);
  const { userId } = route.params;

  useEffect(() => {
    const fetchUser = () => {
      const fetchedUser = realm.objectForPrimaryKey('User', new Realm.BSON.ObjectId(userId));
      setUser(fetchedUser);
    };

    fetchUser();
  }, [realm, userId]);

  const updateUser = (field: string, value: string) => {
    realm.write(() => {
      if (user) {
        user[field] = value;
      }
    });
  };

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <View className="flex-1 p-4">
      <VStack space="md">
        <Text className="text-xl font-bold">User Profile</Text>
        <Input
          placeholder="Name"
          value={user.name}
          onChangeText={(value) => updateUser('name', value)}
        />
        <Input
          placeholder="Phone"
          value={user.phone}
          onChangeText={(value) => updateUser('phone', value)}
        />
        <Input
          placeholder="Email"
          value={user.email || ''}
          onChangeText={(value) => updateUser('email', value)}
        />
        <Select
          selectedValue={user.role}
          onValueChange={(value) => updateUser('role', value)}
        >
          <SelectTrigger>
            <SelectInput placeholder="Select Role" />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label="Customer" value="customer" />
              <SelectItem label="Driver" value="driver" />
            </SelectContent>
          </SelectPortal>
        </Select>
        <Text>Total Ratings: {user.totalRatings || 0}</Text>
        <Text>Average Rating: {user.averageRating?.toFixed(2) || 'N/A'}</Text>
      </VStack>
    </View>
  );
}

