import React, { useState } from "react";
import { View, TextInput } from "react-native";
import { useRealm } from "@/src/hooks/useRealm";
import { Rating } from "@/src/models/RealmModels";
import { Button } from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { HStack } from "@/src/components/ui/hstack";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import { RouteParamsList, RouteName } from "@/src/types/route";
import { Box } from "@/src/components/ui/box";

type RatingScreenRouteProp = RouteProp<RouteParamsList, RouteName.Rating>;

export function RatingScreen() {
  const route = useRoute<RatingScreenRouteProp>();
  const navigation = useNavigation();
  const realm = useRealm();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { tripId, driverId, customerId } = route.params;

  const submitRating = () => {
    realm.write(() => {
      realm.create("Rating", {
        _id: new Realm.BSON.ObjectId(),
        driverId: new Realm.BSON.ObjectId(driverId),
        customerId: new Realm.BSON.ObjectId(customerId),
        tripId: new Realm.BSON.ObjectId(tripId),
        rating: rating,
        comment: comment,
        createdAt: new Date(),
      });
    });
    navigation.goBack();
  };

  return (
    <Box className="flex-1 bg-white p-6">
      <VStack space="md">
        <Text className="text-2xl font-bold mb-4">Rate Your Trip</Text>
        <HStack space="sm" className="justify-center mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              onPress={() => setRating(star)}
              variant={rating >= star ? "solid" : "outline"}
              className={`w-12 h-12 ${rating >= star ? 'bg-yellow-400' : 'border-gray-300'}`}
            >
              <Text className={rating >= star ? 'text-white' : 'text-gray-600'}>{star}</Text>
            </Button>
          ))}
        </HStack>
        <TextInput
          className="p-4 rounded-md border border-gray-300 mb-6"
          placeholder="Leave a comment (optional)"
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
        />
        <Button 
          onPress={submitRating} 
          disabled={rating === 0}
          className={`rounded-md ${rating === 0 ? 'bg-gray-300' : 'bg-blue-500'}`}
        >
          <Text className="text-white font-semibold">Submit Rating</Text>
        </Button>
      </VStack>
    </Box>
  );
}

