import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { useRealm } from '@/src/hooks/useRealm'; // You would need to create this hook
import { Rating } from '@/src/models/RealmModels';
import { Button, Text, VStack, HStack } from '@gluestack-ui/themed';

export function RatingScreen({ route }) {
  const realm = useRealm();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { tripId, driverId, customerId } = route.params;

  const submitRating = () => {
    realm.write(() => {
      realm.create('Rating', {
        _id: new Realm.BSON.ObjectId(),
        driverId: new Realm.BSON.ObjectId(driverId),
        customerId: new Realm.BSON.ObjectId(customerId),
        tripId: new Realm.BSON.ObjectId(tripId),
        rating: rating,
        comment: comment,
        createdAt: new Date(),
      });
    });
    // Navigate back or show confirmation
  };

  return (
    <View className="flex-1 p-4">
      <VStack space="md">
        <Text className="text-xl font-bold">Rate Your Trip</Text>
        <HStack space="sm" justifyContent="center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              onPress={() => setRating(star)}
              variant={rating >= star ? 'solid' : 'outline'}
            >
              <Text>{star}</Text>
            </Button>
          ))}
        </HStack>
        <TextInput
          className="border p-2 rounded"
          placeholder="Leave a comment (optional)"
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <Button onPress={submitRating} disabled={rating === 0}>
          <Text>Submit Rating</Text>
        </Button>
      </VStack>
    </View>
  );
}

