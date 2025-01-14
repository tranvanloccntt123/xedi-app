const APP_STRUCT = "FIXED_ROUTE_DETAIL_SCREEN";

import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/store/store";
import {
  updateFixedRoute,
  deleteFixedRoute,
} from "@/src/store/fixedRoutesSlice";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { InputField } from "@/src/components/ui/input";
import {
  FormControl,
  FormControlLabel,
} from "@/src/components/ui/form-control";
import { ScrollView } from "react-native";
import DateTimePicker from "@/src/components/DateTime";

export default function FixedRouteDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const route = useSelector((state: RootState) =>
    state.fixedRoutes.routes.find((r) => r.id === id)
  );

  const [editMode, setEditMode] = useState(false);
  const [startLocation, setStartLocation] = useState(
    route?.startLocation || ""
  );
  const [endLocation, setEndLocation] = useState(route?.endLocation || "");
  const [departureTime, setDepartureTime] = useState(
    new Date(route?.departureTime || Date.now())
  );
  const [totalSeats, setTotalSeats] = useState(
    route?.totalSeats.toString() || ""
  );
  const [price, setPrice] = useState(route?.price.toString() || "");
  const [showDatePicker, setShowDatePicker] = useState(false);

  if (!route) {
    return (
      <Box className="flex-1 justify-center items-center">
        <Text>Không tìm thấy tuyến đường</Text>
      </Box>
    );
  }

  const handleUpdate = () => {
    const updatedRoute = {
      ...route,
      startLocation,
      endLocation,
      departureTime: departureTime.toISOString(),
      totalSeats: parseInt(totalSeats, 10),
      price: parseFloat(price),
    };
    dispatch(updateFixedRoute(updatedRoute));
    setEditMode(false);
  };

  const handleDelete = () => {
    dispatch(deleteFixedRoute(route.id));
    router.back();
  };

  const onChangeDepartureTime = (date: Date) => {
    setShowDatePicker(false);
    setDepartureTime(date);
  };

  return (
    <Box className="flex-1 bg-gray-100">
      <ScrollView style={{ flex: 1 }}>
        <Box className="flex-1 p-4 bg-gray-100">
          <VStack space="md">
            <Heading size="xl">Chi tiết tuyến cố định</Heading>
            {editMode ? (
              <>
                <FormControl>
                  <FormControlLabel>Điểm đi</FormControlLabel>
                  <Input>
                    <InputField
                      value={startLocation}
                      onChangeText={setStartLocation}
                    />
                  </Input>
                </FormControl>
                <FormControl>
                  <FormControlLabel>Điểm đến</FormControlLabel>
                  <Input>
                    <InputField
                      value={endLocation}
                      onChangeText={setEndLocation}
                    />
                  </Input>
                </FormControl>
                <FormControl>
                  <FormControlLabel>Thời gian khởi hành</FormControlLabel>
                  <Button onPress={() => setShowDatePicker(true)}>
                    <ButtonText>{departureTime.toLocaleString()}</ButtonText>
                  </Button>
                  {showDatePicker && (
                    <DateTimePicker
                      date={departureTime}
                      onChangeDate={onChangeDepartureTime}
                    />
                  )}
                </FormControl>
                <FormControl>
                  <FormControlLabel>Tổng số ghế</FormControlLabel>
                  <Input>
                    <InputField
                      value={totalSeats}
                      onChangeText={setTotalSeats}
                      keyboardType="numeric"
                    />
                  </Input>
                </FormControl>
                <FormControl>
                  <FormControlLabel>Giá</FormControlLabel>
                  <Input>
                    <InputField
                      value={price}
                      onChangeText={setPrice}
                      keyboardType="numeric"
                    />
                  </Input>
                </FormControl>
                <Button onPress={handleUpdate}>
                  <ButtonText>Lưu thay đổi</ButtonText>
                </Button>
              </>
            ) : (
              <>
                <Text>Điểm đi: {route.startLocation}</Text>
                <Text>Điểm đến: {route.endLocation}</Text>
                <Text>
                  Thời gian khởi hành:{" "}
                  {new Date(route.departureTime).toLocaleString()}
                </Text>
                <Text>Tổng số ghế: {route.totalSeats}</Text>
                <Text>Số ghế còn trống: {route.availableSeats}</Text>
                <Text>Giá: {route.price.toLocaleString()} VND</Text>
                <Button onPress={() => setEditMode(true)}>
                  <ButtonText>Chỉnh sửa tuyến đường</ButtonText>
                </Button>
              </>
            )}
            <Button variant="outline" onPress={handleDelete}>
              <ButtonText>Xóa tuyến đường</ButtonText>
            </Button>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  );
}

