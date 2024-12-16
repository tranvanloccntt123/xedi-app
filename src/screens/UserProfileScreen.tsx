import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRealm } from '@/src/hooks/useRealm';
import { User } from '@/src/models/RealmModels';
import { Button } from "@/src/components/ui/button";
import { Input, InputField } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Box } from "@/src/components/ui/box";
import { Card, CardHeader, CardContent } from "@/src/components/ui/card";
import { Select, SelectTrigger, SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectItem } from "@/src/components/ui/select";
import { RouteName, RouteParamsList } from '@/src/types/route';
import { validateName, validateVietnamesePhoneNumber } from "@/src/utils/validation";

type UserProfileScreenRouteProp = RouteProp<RouteParamsList, RouteName.UserProfile>;
type UserProfileScreenNavigationProp = StackNavigationProp<RouteParamsList, RouteName.UserProfile>;

export function UserProfileScreen() {
  const realm = useRealm();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const route = useRoute<UserProfileScreenRouteProp>();
  const navigation = useNavigation<UserProfileScreenNavigationProp>();
  const { userId } = route.params;

  useEffect(() => {
    const fetchUser = () => {
      const fetchedUser = realm.objectForPrimaryKey<User>('User', new Realm.BSON.ObjectId(userId));
      setUser(fetchedUser);
    };

    fetchUser();
  }, [realm, userId]);

  const updateUser = (field: string, value: string) => {
    setError(null);
    if (field === 'name' && !validateName(value)) {
      setError('Name must be between 2 and 50 characters');
      return;
    }
    if (field === 'phone' && !validateVietnamesePhoneNumber(value)) {
      setError('Invalid phone number format');
      return;
    }

    try {
      realm.write(() => {
        if (user) {
          user[field] = value;
        }
      });
    } catch (e) {
      setError('Failed to update user information. Please try again.');
    }
  };

  const handleSave = () => {
    if (error) {
      return;
    }
    navigation.goBack();
  };

  if (!user) {
    return (
      <Box className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-xl">Loading...</Text>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-gray-100 p-6">
      <Card className="mb-6">
        <CardHeader>
          <Text className="text-2xl font-bold text-blue-600">User Profile</Text>
        </CardHeader>
        <CardContent>
          <VStack space="md">
            <Input className="bg-white rounded-md">
              <InputField
                placeholder="Name"
                value={user.name}
                onChangeText={(value) => updateUser('name', value)}
              />
            </Input>
            <Input className="bg-white rounded-md">
              <InputField
                placeholder="Phone"
                value={user.phone}
                onChangeText={(value) => updateUser('phone', value)}
                keyboardType="phone-pad"
              />
            </Input>
            <Input className="bg-white rounded-md">
              <InputField
                placeholder="Email"
                value={user.email || ''}
                onChangeText={(value) => updateUser('email', value)}
                keyboardType="email-address"
              />
            </Input>
            <Select
              selectedValue={user.role}
              onValueChange={(value) => updateUser('role', value)}
            >
              <SelectTrigger className="bg-white border border-gray-300 rounded-md p-3">
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
            <Text className="text-lg"><Text className="font-semibold">Total Ratings:</Text> {user.totalRatings || 0}</Text>
            <Text className="text-lg"><Text className="font-semibold">Average Rating:</Text> {user.averageRating?.toFixed(2) || 'N/A'}</Text>
          </VStack>
        </CardContent>
      </Card>
      {error && <Text className="text-red-500 mb-4">{error}</Text>}
      <Button onPress={handleSave} className="bg-blue-500 rounded-md">
        <Text className="text-white font-semibold">Save Changes</Text>
      </Button>
    </Box>
  );
}

