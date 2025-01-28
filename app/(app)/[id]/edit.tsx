const APP_STRUCT = "EDIT_FIXED_ROUTE_SCREEN"

import React, { useState, useEffect } from "react"
import { ScrollView } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/src/store/store"
import { updateFixedRoute } from "@/src/store/fixedRoutesSlice"
import { Box } from "@/src/components/ui/box"
import { VStack } from "@/src/components/ui/vstack"
import { Heading } from "@/src/components/ui/heading"
import { Text } from "@/src/components/ui/text"
import { Button } from "@/src/components/ui/button"
import { ButtonText } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { InputField } from "@/src/components/ui/input"
import { FormControl, FormControlLabel } from "@/src/components/ui/form-control"
import DateTimePicker from "@/src/components/DateTime"

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
  const [showDatePicker, setShowDatePicker] = useState(false)

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
    const updatedRoute = {
      ...route,
      startLocation,
      endLocation,
      departureTime: departureTime.toISOString(),
      totalSeats: Number.parseInt(totalSeats, 10),
      price: Number.parseFloat(price),
    }
    dispatch(updateFixedRoute(updatedRoute))
    router.push(`/${route.id}/detail`)
  }

  const onChangeDepartureTime = (date: Date) => {
    setShowDatePicker(false)
    setDepartureTime(date)
  }

  return (
    <Box className="flex-1 bg-gray-100">
      <ScrollView style={{ flex: 1 }}>
        <Box className="flex-1 p-4 bg-gray-100">
          <VStack space="md">
            <Heading size="xl">Chỉnh sửa tuyến cố định</Heading>
            <FormControl>
              <FormControlLabel>Điểm đi</FormControlLabel>
              <Input>
                <InputField value={startLocation} onChangeText={setStartLocation} />
              </Input>
            </FormControl>
            <FormControl>
              <FormControlLabel>Điểm đến</FormControlLabel>
              <Input>
                <InputField value={endLocation} onChangeText={setEndLocation} />
              </Input>
            </FormControl>
            <FormControl>
              <FormControlLabel>Thời gian khởi hành</FormControlLabel>
              <Button onPress={() => setShowDatePicker(true)}>
                <ButtonText>{departureTime.toLocaleString()}</ButtonText>
              </Button>
              {showDatePicker && <DateTimePicker date={departureTime} onChangeDate={onChangeDepartureTime} />}
            </FormControl>
            <FormControl>
              <FormControlLabel>Tổng số ghế</FormControlLabel>
              <Input>
                <InputField value={totalSeats} onChangeText={setTotalSeats} keyboardType="numeric" />
              </Input>
            </FormControl>
            <FormControl>
              <FormControlLabel>Giá</FormControlLabel>
              <Input>
                <InputField value={price} onChangeText={setPrice} keyboardType="numeric" />
              </Input>
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

