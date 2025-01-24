import { formatMoney, unformatMoney } from "@/src/utils/formatMoney"

const APP_STRUCT = "CREATE_FIXED_ROUTE_SCREEN"

import React, { useState } from "react"
import { ScrollView } from "react-native"
import { Box } from "@/src/components/ui/box"
import { VStack } from "@/src/components/ui/vstack"
import { Heading } from "@/src/components/ui/heading"
import { Input } from "@/src/components/ui/input"
import { InputField } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { ButtonText } from "@/src/components/ui/button"
import { FormControl, FormControlLabel, FormControlError, FormControlErrorText } from "@/src/components/ui/form-control"
import { useDispatch, useSelector } from "react-redux"
import { addFixedRoute } from "@/src/store/fixedRoutesSlice"
import type { RootState } from "@/src/store/store"
import { useRouter } from "expo-router"
import DateTimePicker from "@/src/components/DateTime"
import type { IFixedRoute } from "@/src/types"
import { Text } from "@/src/components/ui/text"
import { fixedRouteValidator } from "@/src/constants/validator"
import { formValidatePerField, formValidateSuccess } from "@/src/utils/validator"

export default function CreateFixedRoute() {
  const [startLocation, setStartLocation] = useState("")
  const [endLocation, setEndLocation] = useState("")
  const [departureTime, setDepartureTime] = useState(new Date())
  const [totalSeats, setTotalSeats] = useState("")
  const [price, setPrice] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const dispatch = useDispatch()
  const router = useRouter()
  const user = useSelector((state: RootState) => state.auth.user)

  const handleCreateRoute = () => {
    const formData = {
      startLocation,
      endLocation,
      departureTime: departureTime.toISOString(),
      totalSeats,
      price,
    }

    const validateForm = formValidatePerField(fixedRouteValidator, formData as never)
    setErrors(Object.fromEntries(Object.entries(validateForm).map(([key, value]) => [key, value.message])))

    if (formValidateSuccess(validateForm) && user) {
      const newRoute: IFixedRoute = {
        id: Date.now().toString(),
        driverId: user.id || "",
        startLocation,
        endLocation,
        departureTime: departureTime.toISOString(),
        totalSeats: Number.parseInt(totalSeats, 10),
        availableSeats: Number.parseInt(totalSeats, 10),
        price: unformatMoney(price),
        createdAt: new Date(),
      }
      dispatch(addFixedRoute(newRoute))
      router.back()
    }
  }

  const onChangeDepartureTime = (date: Date) => {
    setDepartureTime(date)
    setErrors({ ...errors, departureTime: "" })
  }

  return (
    <Box className="flex-1 bg-gray-100">
      <ScrollView>
        <Box className="p-4">
          <Heading size="xl" className="mb-6">
            Tạo tuyến cố định mới
          </Heading>
          <VStack space="md">
            <FormControl isInvalid={!!errors.startLocation}>
              <FormControlLabel>Điểm đi</FormControlLabel>
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
              <FormControlLabel>Điểm đến</FormControlLabel>
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
                  placeholder="Nhập tổng số ghế"
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
                  placeholder="Nhập giá"
                  value={!!price ? formatMoney(price) : ""}
                  onChangeText={(value) => {
                    const numericValue = unformatMoney(value)
                    if (!isNaN(numericValue)) {
                      setPrice(numericValue.toString())
                    } else {
                      setPrice("")
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

            <Button size="lg" className="mt-4" onPress={handleCreateRoute}>
              <ButtonText>Tạo tuyến đường</ButtonText>
            </Button>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  )
}

