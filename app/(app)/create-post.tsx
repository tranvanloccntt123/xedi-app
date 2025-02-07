import React, { useRef, useState } from "react";
import { Platform, Pressable, ScrollView } from "react-native";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { Heading } from "@/src/components/ui/heading";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MentionInput } from "@/src/components/ControlledMentions";
import { HStack } from "@/src/components/ui/hstack";
import ChevronLeftIcon from "@/src/components/icons/ChevronLeftIcon";
import FixedRouteIcon from "@/src/components/icons/FixedRouteIcon";
import AddFixedRouteModal from "@/src/components/AddFixedRouteModal";

export default function CreatePost() {
  const [fixedRouteModalVisible, setFixedRouteModalVisible] = useState(false);
  //TODO
  const [postType, setPostType] = useState<"ride" | "delivery">("ride");
  const [startLocation, setStartLocation] = useState({
    display_name: "",
    lat: "",
    lon: "",
  });
  const [endLocation, setEndLocation] = useState({
    display_name: "",
    lat: "",
    lon: "",
  });
  const [departureTime, setDepartureTime] = useState(new Date());
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [content, setContent] = useState<string>("");
  const router = useRouter();
  const ref = useRef(null);

  const handleCreatePost = () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    if (!startLocation.display_name)
      newErrors.startLocation = "Start location is required";
    if (!endLocation.display_name)
      newErrors.endLocation = "End location is required";
    if (departureTime <= new Date())
      newErrors.departureTime = "Departure time must be in the future";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // TODO: Implement post creation logic
      console.log("Creating post:", {
        postType,
        startLocation: {
          name: startLocation.display_name,
          lat: startLocation.lat,
          lon: startLocation.lon,
        },
        endLocation: {
          name: endLocation.display_name,
          lat: endLocation.lat,
          lon: endLocation.lon,
        },
        departureTime,
        description,
      });
      router.back();
    }
  };

  return (
    <Box className="flex-1 bg-gray-100">
      <SafeAreaView style={{ flex: 1 }}>
        <Box className="p-4 flex-1">
          <HStack space="sm" className="items-center mb-6">
            <Button variant="link" onPress={router.back}>
              <ChevronLeftIcon size={24} color="#000000" />
            </Button>
            <Heading size="xl" className="flex-1">
              Tạo bài đăng
            </Heading>
            <Button
              className="rounded-full"
              size="lg"
              onPress={handleCreatePost}
            >
              <ButtonText>Tạo</ButtonText>
            </Button>
          </HStack>
          <VStack space="md" className="bg-white flex-1 rounded-2xl p-4">
            <Pressable style={{ flex: 1 }} onPress={() => ref.current?.focus()}>
              <ScrollView showsVerticalScrollIndicator={Platform.OS === "web"}>
                <MentionInput
                  inputRef={ref}
                  value={content}
                  onChange={setContent}
                />
                {/* <FormControl>
                <Text>Post Type</Text>
                <Select
                  selectedValue={postType}
                  onValueChange={(value) =>
                    setPostType(value as "ride" | "delivery")
                  }
                >
                  <SelectTrigger>
                    <SelectInput placeholder="Select post type" />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectItem label="Ride Offer" value="ride" />
                      <SelectItem label="Delivery Request" value="delivery" />
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </FormControl>

              <FormControl isInvalid={!!errors.startLocation}>
                <Text>Start Location</Text>
                <LocationSearch
                  onSelectLocation={(location) => {
                    setStartLocation(location);
                    setErrors({ ...errors, startLocation: "" });
                  }}
                />
                <FormControlError>
                  <FormControlErrorText>
                    {errors.startLocation}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl isInvalid={!!errors.endLocation}>
                <Text>End Location</Text>
                <LocationSearch
                  onSelectLocation={(location) => {
                    setEndLocation(location);
                    setErrors({ ...errors, endLocation: "" });
                  }}
                />
                <FormControlError>
                  <FormControlErrorText>
                    {errors.endLocation}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl isInvalid={!!errors.departureTime}>
                <Text>Departure Time</Text>
                <DateTimePicker
                  date={departureTime}
                  onChangeDate={(date) => {
                    setDepartureTime(date);
                    setErrors({ ...errors, departureTime: "" });
                  }}
                />
                <FormControlError>
                  <FormControlErrorText>
                    {errors.departureTime}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl>
                <Text>Description</Text>
                <Input>
                  <InputField
                    placeholder="Enter description"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                  />
                </Input>
              </FormControl>

              <Button size="lg" className="mt-4" onPress={handleCreatePost}>
                <ButtonText>Create Post</ButtonText>
              </Button> */}
              </ScrollView>
            </Pressable>
          </VStack>
          <HStack space="lg" className="mt-4">
            <Button
              variant="link"
              onPress={() => setFixedRouteModalVisible(true)}
            >
              <HStack space="sm" className="items-center">
                <Box className="w-[30px] h-[30px] bg-typography-100 items-center justify-center rounded-full">
                  <FixedRouteIcon size={18} color="#000000" />
                </Box>
                <ButtonText className="text-black">
                  Tạo tuyến cố định
                </ButtonText>
              </HStack>
            </Button>
          </HStack>
        </Box>
      </SafeAreaView>
      <AddFixedRouteModal
        visible={fixedRouteModalVisible}
        onClose={() => setFixedRouteModalVisible(false)}
      />
    </Box>
  );
}
