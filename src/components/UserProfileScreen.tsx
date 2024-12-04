import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useRealm } from '@/src/hooks/useRealm';
import { User } from '@/src/models/RealmModels';
import { Button } from "@/src/components/ui/button";
import { Input, InputField } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Select, SelectTrigger, SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectItem } from "@/src/components/ui/select";

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
        <Input>
          <InputField
            placeholder="Name"
            value={user.name}
            onChangeText={(value) => updateUser('name', value)}
          />
        </Input>
        <Input>
          <InputField
            placeholder="Phone"
            value={user.phone}
            onChangeText={(value) => updateUser('phone', value)}
          />
        </Input>
        <Input>
          <InputField
            placeholder="Email"
            value={user.email || ''}
            onChangeText={(value) => updateUser('email', value)}
          />
        </Input>
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

