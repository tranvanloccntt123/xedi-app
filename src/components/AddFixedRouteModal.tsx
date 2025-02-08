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
} from "./ui/form-control";
import LocationSearch from "./LocationSearch";
import DateTimePicker from "./DateTime";
import { VStack } from "./ui/vstack";
import { xediSupabase } from "../lib/supabase";
import { formatMoney, unformatMoney } from "../utils/formatMoney";
import {
  formValidate,
  formValidatePerField,
  formValidateSuccess,
} from "../utils/validator";
import { fixedRouteValidator, locationValidator } from "../constants/validator";
import { Box } from "./ui/box";

enum LocationFor {
  START_LOCATION,
  END_LOCATION,
}

const AddFixedRouteModal: React.FC<{
  visible: boolean;
  onClose?: () => any;
}> = ({ visible, onClose }) => {
  const setLocationFor = React.useRef(LocationFor.START_LOCATION);
  const [locationModal, setLocationModal] = React.useState(false);

  const [startLocation, setStartLocation] = React.useState({
    display_name: "",
    lat: "",
    lon: "",
  });
  const [endLocation, setEndLocation] = React.useState({
    display_name: "",
    lat: "",
    lon: "",
  });
  const [price, setPrice] = React.useState("");
  const [totalSeats, setTotalSeats] = React.useState("");
  const [departureTime, setDepartureTime] = React.useState(new Date());
  const [description, setDescription] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const onCreateFixedRoute = async () => {
    const _errors = {};
    const validateStartLocation = formValidatePerField(
      locationValidator,
      startLocation
    );

    if (!formValidateSuccess(validateStartLocation)) {
      _errors["startLocation"] = validateStartLocation["display_name"].message;
    }

    const validateEndLocation = formValidatePerField(
      locationValidator,
      endLocation
    );

    if (!formValidateSuccess(validateEndLocation)) {
      _errors["endLocation"] = validateEndLocation["display_name"].message;
    }

    const formData = {
      departureTime: departureTime.toISOString(),
      totalSeats,
      price,
    };
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
      return;
    }

    xediSupabase.tables.fixedRoutes.add([
      {
        startLocation,
        endLocation,
        departureTime,
        description,
        totalSeats: parseInt(totalSeats),
        availableSeats: parseInt(totalSeats),
        price: parseFloat(price),
      },
    ]);
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
                    {startLocation.display_name || "Điểm khởi hành"}
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
                {!!errors.endLocation && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.endLocation}
                  </Text>
                )}
              </Box>

              <FormControl isInvalid={!!errors.departureTime}>
                <Text>Khởi hành lúc</Text>
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
                {!!errors.departureTime && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.departureTime}
                  </Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.price}>
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
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorText>{errors.price}</FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl>
                <Text>Mô tả thêm về hành trình</Text>
                <Input>
                  <InputField
                    placeholder="Nhập mô tả"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
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
