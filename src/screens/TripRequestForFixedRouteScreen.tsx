import React, { useState } from 'react';
import { View } from 'react-native';
import { useRealm } from '@/src/hooks/useRealm';
import { TripRequestForFixedRoute } from '@/src/models/RealmModels';
import { Button } from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Select, SelectTrigger, SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectItem } from "@/src/components/ui/select";

export function TripRequestForFixedRouteScreen({ route }) {
  const realm = useRealm();
  const [requestType, setRequestType] = useState<'join' | 'cancel'>('join');
  const { fixedRouteId, customerId } = route.params;

  const submitTripRequestForFixedRoute = () => {
    realm.write(() => {
      realm.create('TripRequestForFixedRoute', {
        _id: new Realm.BSON.ObjectId(),
        fixedRouteId: new Realm.BSON.ObjectId(fixedRouteId),
        customerId: new Realm.BSON.ObjectId(customerId),
        requestType,
        status: 'pending',
        requestTime: new Date(),
        updatedAt: new Date(),
      });
    });
    // Navigate back or show confirmation
  };

  return (
    <View className="flex-1 p-4">
      <VStack space="md">
        <Text className="text-xl font-bold">Request for Fixed Route</Text>
        <Select
          selectedValue={requestType}
          onValueChange={(value) => setRequestType(value as 'join' | 'cancel')}
        >
          <SelectTrigger>
            <SelectInput placeholder="Select Request Type" />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label="Join" value="join" />
              <SelectItem label="Cancel" value="cancel" />
            </SelectContent>
          </SelectPortal>
        </Select>
        <Button onPress={submitTripRequestForFixedRoute}>
          <Text>Submit Request</Text>
        </Button>
      </VStack>
    </View>
  );
}

