const APP_STRUCT = "CREATE_TRIP_REQUEST_SCREEN"

import { useState } from "react"
import { ScrollView } from "react-native"
import { Box } from "@/src/components/ui/box"
import { VStack } from "@/src/components/ui/vstack"
import { Heading } from "@/src/components/ui/heading"
import { Input } from "@/src/components/ui/input"
import { InputField } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { ButtonText } from "@/src/components/ui/button"
import { FormControl, FormControlError, FormControlErrorText } from "@/src/components/ui/form-control"
import { Text } from "@/src/components/ui/text"
import { useDispatch, useSelector } from "react-redux"
import { addTripRequest } from "@/src/store/tripRequestsSlice"
import type { RootState } from "@/src/store/store"
import { useRouter } from "expo-router"
import DateTimePicker from "@/src/components/DateTime"
import type { ITripRequest } from "@/src/types"
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select"

export default function CreateTripRequest() {
  const [startLocation, setStartLocation] = useState("")
  const [endLocation, setEndLocation] = useState("")
  const [departureTime, setDepartureTime] = useState(new Date())
  const [type, setType] = useState<"Delivery" | "Taxi">("Taxi")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const dispatch = useDispatch()
  const router = useRouter()
  const user = useSelector((state: RootState) => state.auth.user)

  const handleCreateRequest = () => {
    // Simple validation
    const newErrors: Record<string, string> = {}
    if (!startLocation) newErrors.startLocation = "Điểm đi không được để trống"
    if (!endLocation) newErrors.endLocation = "Điểm đến không được để trống"
    if (departureTime <= new Date()) newErrors.departureTime = "Thời gian khởi hành phải là trong tương lai"

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0 && user) {
      const newRequest: ITripRequest = {
        id: Date.now().toString(),
        customerId: user.id,
        startLocation,
        endLocation,
        departureTime,
        status: "pending",
        requestTime: new Date(),
        updatedAt: new Date(),
        riderRequests: [],
        type,
      }
      dispatch(addTripRequest(newRequest))
      router.back()
    }
  }

  return (
    <Box className="flex-1 bg-gray-100">
      <ScrollView>
        <Box className="p-4">
          <Heading size="xl" className="mb-6">
            Tạo yêu cầu chuyến đi mới
          </Heading>
          <VStack space="md">
            <FormControl isInvalid={!!errors.startLocation}>
              <Text className="mb-2 text-sm font-medium text-gray-700">Điểm đi</Text>
              <Input>
                <InputField
                  placeholder="Nhập điểm đi"
                  value={startLocation}
                  onChangeText={(value) => {
                    setStartLocation(value)
                    setErrors({ ...errors, startLocation: "" })
                  }}
                />
              </Input>
              <FormControlError>
                <FormControlErrorText>{errors.startLocation}</FormControlErrorText>
              </FormControlError>
            </FormControl>

            <FormControl isInvalid={!!errors.endLocation}>
              <Text className="mb-2 text-sm font-medium text-gray-700">Điểm đến</Text>
              <Input>
                <InputField
                  placeholder="Nhập điểm đến"
                  value={endLocation}
                  onChangeText={(value) => {
                    setEndLocation(value)
                    setErrors({ ...errors, endLocation: "" })
                  }}
                />
              </Input>
              <FormControlError>
                <FormControlErrorText>{errors.endLocation}</FormControlErrorText>
              </FormControlError>
            </FormControl>

            <FormControl isInvalid={!!errors.departureTime}>
              <Text className="mb-2 text-sm font-medium text-gray-700">Thời gian khởi hành</Text>
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
              <Text className="mb-2 text-sm font-medium text-gray-700">Loại chuyến đi</Text>
              <Select selectedValue={type} onValueChange={(value) => setType(value as "Delivery" | "Taxi")}>
                <SelectTrigger>
                  <SelectInput placeholder="Chọn loại chuyến đi" />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectItem label="Taxi" value="Taxi" />
                    <SelectItem label="Giao hàng" value="Delivery" />
                  </SelectContent>
                </SelectPortal>
              </Select>
            </FormControl>

            <Button size="lg" className="mt-4" onPress={handleCreateRequest}>
              <ButtonText>Tạo yêu cầu chuyến đi</ButtonText>
            </Button>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  )
}

