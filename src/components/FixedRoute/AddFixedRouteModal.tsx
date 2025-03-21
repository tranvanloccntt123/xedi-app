const APP_STRUCT = "ADD_FIXED_ROUTE_MODAL";

import React from "react";
import { Button, ButtonText, ButtonIcon } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { Input, InputField } from "@/src/components/ui/input";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/src/components/ui/modal";
import { Text } from "@/src/components/ui/text";
import { ArrowLeftIcon } from "@/src/components/ui/icon";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "../ui/form-control";
import LocationSearch from "../Location/LocationSearch";
import DateTimePicker from "../DateTime";
import { VStack } from "../ui/vstack";
import { xediSupabase } from "../../lib/supabase";
import { formatMoney, unformatMoney } from "../../utils/formatMoney";
import {
  formValidate,
  formValidatePerField,
  formValidateSuccess,
} from "../../utils/validator";
import { fixedRouteValidator, locationValidator } from "../../constants/validator";
import { Box } from "../ui/box";
import { IFixedRoute, InputLocation } from "../../types";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
} from "@/src/components/ui/checkbox";
import { CheckIcon } from "@/src/components/ui/icon";

enum LocationFor {
  START_LOCATION,
  END_LOCATION,
}

const AddFixedRouteModal: React.FC<{
  visible: boolean;
  onClose?: () => any;
  onFixedRouteCreated?: (fixedRoute: IFixedRoute) => any;
}> = ({ visible, onClose, onFixedRouteCreated }) => {
  const setLocationFor = React.useRef(LocationFor.START_LOCATION);
  const [locationModal, setLocationModal] = React.useState(false);

  const [startLocation, setStartLocation] = React.useState<InputLocation>({
    display_name: "",
    lat: 0,
    lon: 0,
  });
  const [endLocation, setEndLocation] = React.useState<InputLocation>({
    display_name: "",
    lat: 0,
    lon: 0,
  });
  const [price, setPrice] = React.useState("");
  const [totalSeats, setTotalSeats] = React.useState("");
  const [departureTime, setDepartureTime] = React.useState(new Date());
  const [description, setDescription] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isFlexDepartureTime, setIsFlexDepartureTime] = React.useState(false);
  const onCreateFixedRoute = async () => {
    const _errors = {};
    const validateStartLocation = formValidatePerField(
      locationValidator,
      startLocation as never
    );

    if (!formValidateSuccess(validateStartLocation)) {
      _errors["startLocation"] = validateStartLocation["display_name"].message;
    }

    const validateEndLocation = formValidatePerField(
      locationValidator,
      endLocation as never
    );

    if (!formValidateSuccess(validateEndLocation)) {
      _errors["endLocation"] = validateEndLocation["display_name"].message;
    }

    const formData = {
      totalSeats,
      price,
    };

    if (!isFlexDepartureTime) {
      formData["departureTime"] = departureTime.toISOString();
    }

    const validateForm = formValidatePerField(
      fixedRouteValidator,
      formData as never
    );

    if (!formValidateSuccess(validateForm)) {
      Object.keys(validateForm).forEach((key) => {
        if (!validateForm[key].status) {
          _errors[key] = validateForm[key].message;
        }
      });
    }

    if (Object.keys(_errors).length !== 0) {
      setErrors(_errors);
      console.log(_errors);
      return;
    }

    try {
      const { data } = await xediSupabase.tables.fixedRoutes.addWithUserId([
        {
          startLocation,
          endLocation,
          departureTime: isFlexDepartureTime ? undefined : departureTime,
          description,
          totalSeats: parseInt(totalSeats),
          availableSeats: parseInt(totalSeats),
          price: parseFloat(price),
        },
      ]);
      if (data?.[0]) {
        onFixedRouteCreated?.(data[0]);
      }
    } catch (e) {
      console.log(e);
    }
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={visible}
        onClose={() => {
          onClose();
        }}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader className="flex-col items-start gap-0.5">
            <Heading>Bắt đầu hành trình mới?</Heading>
            <Text size="sm">Chúc bạn có một hành trình an toàn!</Text>
          </ModalHeader>
          <ModalBody className="mb-4">
            <VStack space="md">
              <Box>
                <Button
                  onPress={() => {
                    setLocationModal(true);
                    setLocationFor.current = LocationFor.START_LOCATION;
                  }}
                >
                  <ButtonText>
                    {startLocation?.display_name || "Điểm khởi hành"}
                  </ButtonText>
                </Button>
                {!!errors.startLocation && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.startLocation}
                  </Text>
                )}
              </Box>
              <Box>
                <Button
                  className="bg-typography-900"
                  onPress={() => {
                    setLocationModal(true);
                    setLocationFor.current = LocationFor.END_LOCATION;
                  }}
                >
                  <ButtonText>
                    {endLocation.display_name || "Điểm đến"}
                  </ButtonText>
                </Button>
              </Box>

              <Box>
                <Text
                  className={`${
                    isFlexDepartureTime ? "text-typography-300" : "text-black"
                  }`}
                >
                  Khởi hành lúc
                </Text>
                <DateTimePicker
                  isDisabled={isFlexDepartureTime}
                  date={departureTime}
                  onChangeDate={(date) => {
                    setDepartureTime(date);
                    setErrors({ ...errors, departureTime: "" });
                  }}
                />
                {!!errors.departureTime && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.departureTime}
                  </Text>
                )}
              </Box>
              <Checkbox
                value={"isFlex"}
                size="md"
                isInvalid={false}
                isDisabled={false}
                onChange={setIsFlexDepartureTime}
              >
                <CheckboxIndicator>
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel>Thời gian linh động</CheckboxLabel>
              </Checkbox>
              <Box>
                <Text>Giá (VND)</Text>
                <Input>
                  <InputField
                    value={!price ? "" : formatMoney(price)}
                    onChangeText={(value) => {
                      const numericValue = unformatMoney(value);
                      if (!isNaN(numericValue)) {
                        setPrice(numericValue.toString());
                      }
                      setErrors({ ...errors, price: "" });
                    }}
                    keyboardType="numeric"
                    placeholder="Nhập giá tiền"
                  />
                </Input>
                {!!errors.price && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.price}
                  </Text>
                )}
              </Box>

              <Box>
                <Text>Số ghế trống</Text>
                <Input>
                  <InputField
                    value={totalSeats}
                    onChangeText={setTotalSeats}
                    keyboardType="numeric"
                    placeholder="Nhập số ghế"
                  />
                </Input>
                {!!errors.totalSeats && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.totalSeats}
                  </Text>
                )}
              </Box>

              <FormControl>
                <Text>Mô tả thêm về hành trình</Text>
                <Input className="h-[100px]">
                  <InputField
                    placeholder="Nhập mô tả"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    textAlignVertical="top"
                  />
                </Input>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter className="flex-col items-start">
            <Button
              onPress={() => {
                onCreateFixedRoute();
              }}
              className="w-full"
            >
              <ButtonText>Tạo</ButtonText>
            </Button>
            <Button
              variant="link"
              size="sm"
              onPress={() => {
                onClose();
              }}
              className="gap-1"
            >
              <ButtonIcon as={ArrowLeftIcon} />
              <ButtonText>Quay lại</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={locationModal}
        onClose={() => {
          setLocationModal(false);
        }}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader className="flex-col items-start gap-0.5">
            <Heading>Tìm vị trí</Heading>
            <Text size="sm">
              Nhập địa chỉ bạn muốn tìm kiếm vào ô tìm kiếm.
            </Text>
          </ModalHeader>
          <ModalBody className="mb-4">
            <FormControl isInvalid={!!errors.startLocation}>
              <LocationSearch
                onSelectLocation={(location) => {
                  if (setLocationFor.current === LocationFor.START_LOCATION) {
                    setStartLocation(location);
                  } else {
                    setEndLocation(location);
                  }
                  setErrors({ ...errors, startLocation: "" });
                  setLocationModal(false);
                }}
              />
              <FormControlError>
                <FormControlErrorText>
                  {errors.startLocation}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddFixedRouteModal;
