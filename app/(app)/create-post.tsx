import React, { useState } from "react"
import { ScrollView } from "react-native"
import { Box } from "@/src/components/ui/box"
import { VStack } from "@/src/components/ui/vstack"
import { Heading } from "@/src/components/ui/heading"
import { Input } from "@/src/components/ui/input"
import { InputField } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { ButtonText } from "@/src/components/ui/button"
import { FormControl, FormControlError, FormControlErrorText } from "@/src/components/ui/form-control"
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select"
import { useRouter } from "expo-router"
import DateTimePicker from "@/src/components/DateTime"
import LocationSearch from "@/src/components/LocationSearch"
import { Text } from "@/src/components/ui/text"

export default function CreatePost() {
  const [postType, setPostType] = useState<"ride" | "delivery">("ride")
  const [startLocation, setStartLocation] = useState({ display_name: "", lat: "", lon: "" })
  const [endLocation, setEndLocation] = useState({ display_name: "", lat: "", lon: "" })
  const [departureTime, setDepartureTime] = useState(new Date())
  const [description, setDescription] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const router = useRouter()

  const handleCreatePost = () => {
    // Validate form
    const newErrors: Record<string, string> = {}
    if (!startLocation.display_name) newErrors.startLocation = "Start location is required"
    if (!endLocation.display_name) newErrors.endLocation = "End location is required"
    if (departureTime <= new Date()) newErrors.departureTime = "Departure time must be in the future"
    setErrors(newErrors)

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
      })
      router.back()
    }
  }

  return (
    <Box className="flex-1 bg-gray-100">
      <ScrollView>
        <Box className="p-4">
          <Heading size="xl" className="mb-6">
            Create New Post
          </Heading>
          <VStack space="md">
            <FormControl>
              <Text>Post Type</Text>
              <Select selectedValue={postType} onValueChange={(value) => setPostType(value as "ride" | "delivery")}>
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
                  setStartLocation(location)
                  setErrors({ ...errors, startLocation: "" })
                }}
              />
              <FormControlError>
                <FormControlErrorText>{errors.startLocation}</FormControlErrorText>
              </FormControlError>
            </FormControl>

            <FormControl isInvalid={!!errors.endLocation}>
              <Text>End Location</Text>
              <LocationSearch
                onSelectLocation={(location) => {
                  setEndLocation(location)
                  setErrors({ ...errors, endLocation: "" })
                }}
              />
              <FormControlError>
                <FormControlErrorText>{errors.endLocation}</FormControlErrorText>
              </FormControlError>
            </FormControl>

            <FormControl isInvalid={!!errors.departureTime}>
              <Text>Departure Time</Text>
              <DateTimePicker
                date={departureTime}
                onChangeDate={(date) => {
                  setDepartureTime(date)
                  setErrors({ ...errors, departureTime: "" })
                }}
              />
              <FormControlError>
                <FormControlErrorText>{errors.departureTime}</FormControlErrorText>
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
            </Button>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  )
}

