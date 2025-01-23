import { formatMoney, unformatMoney } from "@/src/utils/formatMoney";

const APP_STRUCT = "CREATE_FIXED_ROUTE_SCREEN";

import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { Heading } from "@/src/components/ui/heading";
import { Input } from "@/src/components/ui/input";
import { InputField } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import {
  FormControl,
  FormControlLabel,
} from "@/src/components/ui/form-control";
import { useDispatch, useSelector } from "react-redux";
import { addFixedRoute } from "@/src/store/fixedRoutesSlice";
import type { RootState } from "@/src/store/store";
import { useRouter } from "expo-router";
import DateTimePicker from "@/src/components/DateTime";
import type { IFixedRoute } from "@/src/types";

export default function CreateFixedRoute() {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [departureTime, setDepartureTime] = useState(new Date());
  const [totalSeats, setTotalSeats] = useState("");
  const [price, setPrice] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleCreateRoute = () => {
    if (user) {
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
      };
      dispatch(addFixedRoute(newRoute));
      router.back();
    }
  };

  const onChangeDepartureTime = (date: Date) => {
    setDepartureTime(date);
  };

  return (
    <Box className="flex-1 bg-gray-100">
      <ScrollView>
        <Box className="p-4">
          <Heading size="xl" className="mb-6">
            Tạo tuyến cố định mới
          </Heading>
          <VStack space="md">
            <FormControl>
              <FormControlLabel>Điểm đi</FormControlLabel>
              <Input>
                <InputField
                  placeholder="Nhập điểm đi"
                  value={startLocation}
                  onChangeText={setStartLocation}
                />
              </Input>
            </FormControl>

            <FormControl>
              <FormControlLabel>Điểm đến</FormControlLabel>
              <Input>
                <InputField
                  placeholder="Nhập điểm đến"
                  value={endLocation}
                  onChangeText={setEndLocation}
                />
              </Input>
            </FormControl>

            <FormControl>
              <FormControlLabel>Thời gian khởi hành</FormControlLabel>
            </FormControl>
            <DateTimePicker
              date={departureTime}
              onChangeDate={onChangeDepartureTime}
            />

            <FormControl>
              <FormControlLabel>Tổng số ghế</FormControlLabel>
              <Input>
                <InputField
                  placeholder="Nhập tổng số ghế"
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
                  placeholder="Nhập giá"
                  value={!!price ? formatMoney(price) : ""}
                  onChangeText={(value) => {
                    const numericValue = unformatMoney(value);
                    if (!isNaN(numericValue)) {
                      setPrice(numericValue.toString());
                    } else {
                      setPrice("");
                    }
                  }}
                  keyboardType="numeric"
                />
              </Input>
            </FormControl>

            <Button size="lg" className="mt-4" onPress={handleCreateRoute}>
              <ButtonText>Tạo tuyến đường</ButtonText>
            </Button>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  );
}
