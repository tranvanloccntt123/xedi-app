const APP_STRUCT = "EDIT_FIXED_ROUTE_SCREEN"

import React, { useState, useEffect } from "react"
import { ScrollView } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/src/store/store"
import { updateFixedRoute } from "@/src/store/fixedRoute/fixedRoutesSlice"
import { Box } from "@/src/components/ui/box"
import { VStack } from "@/src/components/ui/vstack"
import { Heading } from "@/src/components/ui/heading"
import { Text } from "@/src/components/ui/text"
import { Button } from "@/src/components/ui/button"
import { ButtonText } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { InputField } from "@/src/components/ui/input"
import { FormControl, FormControlLabel, FormControlError, FormControlErrorText } from "@/src/components/ui/form-control"
import DateTimePicker from "@/src/components/DateTime"
import { formatMoney, unformatMoney } from "@/src/utils/formatMoney"
import { fixedRouteValidator } from "@/src/constants/validator"
import { formValidatePerField, formValidateSuccess } from "@/src/utils/validator"

export default function EditFixedRoute() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const route = useSelector((state: RootState) => state.fixedRoutes.routes.find((r) => r.id === id))

  const [startLocation, setStartLocation] = useState(route?.start_location || "")
  const [endLocation, setEndLocation] = useState(route?.end_location || "")
  const [departureTime, setDepartureTime] = useState(new Date(route?.departure_time || Date.now()))
  const [totalSeats, setTotalSeats] = useState(route?.total_seats.toString() || "")
  const [price, setPrice] = useState(route?.price.toString() || "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (route) {
      setStartLocation(route.start_location)
      setEndLocation(route.end_location)
      setDepartureTime(new Date(route.departure_time))
      setTotalSeats(route.total_seats.toString())
      setPrice(route.price.toString())
    }
  }, [route])

  if (!route) {
    return (
      <Box className="flex-1 justify-center items-center">
        <Text>Không tìm thấy tuyến đường</Text>
      </Box>
    )
  }

  const handleUpdate = () => {
    const formData = {
      start_location: startLocation,
      end_location: endLocation,
      departure_time: departureTime.toISOString(),
      total_seats: totalSeats,
      price,
    }

    const validateForm = formValidatePerField(fixedRouteValidator, formData as never)
    setErrors(Object.fromEntries(Object.entries(validateForm).map(([key, value]) => [key, value.message])))

    if (formValidateSuccess(validateForm)) {
      const updatedRoute = {
        ...route,
        start_location: startLocation,
        end_location: endLocation,
        departure_time: departureTime.toISOString(),
        total_seats: Number.parseInt(totalSeats, 10),
        price: unformatMoney(price),
      }
      dispatch(updateFixedRoute(updatedRoute))
      router.push(`/fixed/${route.id}/detail`)
    }
  }

  const onChangedeparture_time = (date: Date) => {
    setDepartureTime(date)
    setErrors({ ...errors, departure_time: "" })
  }

  return (
    <Box className="flex-1 bg-gray-100">
      <ScrollView style={{ flex: 1 }}>
        <Box className="flex-1 p-4 bg-gray-100">
          <VStack space="md">
            <Heading size="xl">Chỉnh sửa tuyến cố định</Heading>
            <FormControl isInvalid={!!errors.start_location}>
              <FormControlLabel>Điểm đi</FormControlLabel>
              <Input>
                <InputField
                  value={startLocation}
                  onChangeText={(value) => {
                    setStartLocation(value)
                    setErrors({ ...errors, start_location: "" })
                  }}
                />
              </Input>
              <FormControlError>
                <FormControlErrorText>{errors.start_location}</FormControlErrorText>
              </FormControlError>
            </FormControl>
            <FormControl isInvalid={!!errors.end_location}>
              <FormControlLabel>Điểm đến</FormControlLabel>
              <Input>
                <InputField
                  value={endLocation}
                  onChangeText={(value) => {
                    setEndLocation(value)
                    setErrors({ ...errors, end_location: "" })
                  }}
                />
              </Input>
              <FormControlError>
                <FormControlErrorText>{errors.end_location}</FormControlErrorText>
              </FormControlError>
            </FormControl>
            <FormControl isInvalid={!!errors.departure_time}>
              <FormControlLabel>Thời gian khởi hành</FormControlLabel>
              <DateTimePicker date={departureTime} onChangeDate={onChangedeparture_time} />
              <FormControlError>
                <FormControlErrorText>{errors.departure_time}</FormControlErrorText>
              </FormControlError>
            </FormControl>
            <FormControl isInvalid={!!errors.total_seats}>
              <FormControlLabel>Tổng số ghế</FormControlLabel>
              <Input>
                <InputField
                  value={totalSeats}
                  onChangeText={(value) => {
                    setTotalSeats(value)
                    setErrors({ ...errors, total_seats: "" })
                  }}
                  keyboardType="numeric"
                />
              </Input>
              <FormControlError>
                <FormControlErrorText>{errors.total_seats}</FormControlErrorText>
              </FormControlError>
            </FormControl>
            <FormControl isInvalid={!!errors.price}>
              <FormControlLabel>Giá</FormControlLabel>
              <Input>
                <InputField
                  value={formatMoney(price)}
                  onChangeText={(value) => {
                    const numericValue = unformatMoney(value)
                    if (!isNaN(numericValue)) {
                      setPrice(numericValue.toString())
                    } else {
                      setPrice("");
                    }
                    setErrors({ ...errors, price: "" })
                  }}
                  keyboardType="numeric"
                />
              </Input>
              <FormControlError>
                <FormControlErrorText>{errors.price}</FormControlErrorText>
              </FormControlError>
            </FormControl>
            <Button onPress={handleUpdate}>
              <ButtonText>Lưu thay đổi</ButtonText>
            </Button>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  )
}

