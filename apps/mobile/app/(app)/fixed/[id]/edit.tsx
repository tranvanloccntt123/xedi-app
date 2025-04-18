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

  const [startLocation, setStartLocation] = useState(route?.startLocation || "")
  const [endLocation, setEndLocation] = useState(route?.endLocation || "")
  const [departureTime, setDepartureTime] = useState(new Date(route?.departureTime || Date.now()))
  const [totalSeats, setTotalSeats] = useState(route?.totalSeats.toString() || "")
  const [price, setPrice] = useState(route?.price.toString() || "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (route) {
      setStartLocation(route.startLocation)
      setEndLocation(route.endLocation)
      setDepartureTime(new Date(route.departureTime))
      setTotalSeats(route.totalSeats.toString())
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
      startLocation,
      endLocation,
      departureTime: departureTime.toISOString(),
      totalSeats,
      price,
    }

    const validateForm = formValidatePerField(fixedRouteValidator, formData as never)
    setErrors(Object.fromEntries(Object.entries(validateForm).map(([key, value]) => [key, value.message])))

    if (formValidateSuccess(validateForm)) {
      const updatedRoute = {
        ...route,
        startLocation,
        endLocation,
        departureTime: departureTime.toISOString(),
        totalSeats: Number.parseInt(totalSeats, 10),
        price: unformatMoney(price),
      }
      dispatch(updateFixedRoute(updatedRoute))
      router.push(`/fixed/${route.id}/detail`)
    }
  }

  const onChangeDepartureTime = (date: Date) => {
    setDepartureTime(date)
    setErrors({ ...errors, departureTime: "" })
  }

  return (
    <Box className="flex-1 bg-gray-100">
      <ScrollView style={{ flex: 1 }}>
        <Box className="flex-1 p-4 bg-gray-100">
          <VStack space="md">
            <Heading size="xl">Chỉnh sửa tuyến cố định</Heading>
            <FormControl isInvalid={!!errors.startLocation}>
              <FormControlLabel>Điểm đi</FormControlLabel>
              <Input>
                <InputField
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
              <FormControlLabel>Điểm đến</FormControlLabel>
              <Input>
                <InputField
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
              <FormControlLabel>Thời gian khởi hành</FormControlLabel>
              <DateTimePicker date={departureTime} onChangeDate={onChangeDepartureTime} />
              <FormControlError>
                <FormControlErrorText>{errors.departureTime}</FormControlErrorText>
              </FormControlError>
            </FormControl>
            <FormControl isInvalid={!!errors.totalSeats}>
              <FormControlLabel>Tổng số ghế</FormControlLabel>
              <Input>
                <InputField
                  value={totalSeats}
                  onChangeText={(value) => {
                    setTotalSeats(value)
                    setErrors({ ...errors, totalSeats: "" })
                  }}
                  keyboardType="numeric"
                />
              </Input>
              <FormControlError>
                <FormControlErrorText>{errors.totalSeats}</FormControlErrorText>
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

