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
import { xediSupabase } from "supabase-client";
import { formatMoney, unformatMoney } from "../../utils/formatMoney";
import {
  formValidatePerField,
  formValidateSuccess,
} from "../../utils/validator";
import {
  fixedRouteValidator,
  locationValidator,
} from "../../constants/validator";
import { Box } from "../ui/box";
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

  const [start_location, setstart_location] = React.useState<InputLocation>({
    display_name: "",
    lat: 0,
    lon: 0,
  });
  const [end_location, setend_location] = React.useState<InputLocation>({
    display_name: "",
    lat: 0,
    lon: 0,
  });
  const [price, setPrice] = React.useState("");
  const [total_seats, settotal_seats] = React.useState("");
  const [departure_time, setdeparture_time] = React.useState(new Date());
  const [description, setDescription] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isFlexdeparture_time, setIsFlexdeparture_time] = React.useState(false);
  const onCreateFixedRoute = async () => {
    const _errors = {};
    const validatestart_location = formValidatePerField(
      locationValidator,
      start_location as never
    );

    if (!formValidateSuccess(validatestart_location)) {
      _errors["start_location"] = validatestart_location["display_name"].message;
    }

    const validateend_location = formValidatePerField(
      locationValidator,
      end_location as never
    );

    if (!formValidateSuccess(validateend_location)) {
      _errors["end_location"] = validateend_location["display_name"].message;
    }

    const formData = {
      total_seats,
      price,
    };

    if (!isFlexdeparture_time) {
      formData["departure_time"] = departure_time.toISOString();
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
          start_location,
          end_location,
          departure_time: isFlexdeparture_time ? undefined : departure_time,
          description,
          total_seats: parseInt(total_seats),
          available_seats: parseInt(total_seats),
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
                    {start_location?.display_name || "Điểm khởi hành"}
                  </ButtonText>
                </Button>
                {!!errors.start_location && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.start_location}
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
                    {end_location.display_name || "Điểm đến"}
                  </ButtonText>
                </Button>
              </Box>

              <Box>
                <Text
                  className={`${
                    isFlexdeparture_time ? "text-typography-300" : "text-black"
                  }`}
                >
                  Khởi hành lúc
                </Text>
                <DateTimePicker
                  isDisabled={isFlexdeparture_time}
                  date={departure_time}
                  onChangeDate={(date) => {
                    setdeparture_time(date);
                    setErrors({ ...errors, departure_time: "" });
                  }}
                />
                {!!errors.departure_time && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.departure_time}
                  </Text>
                )}
              </Box>
              <Checkbox
                value={"isFlex"}
                size="md"
                isInvalid={false}
                isDisabled={false}
                onChange={setIsFlexdeparture_time}
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
                    value={total_seats}
                    onChangeText={settotal_seats}
                    keyboardType="numeric"
                    placeholder="Nhập số ghế"
                  />
                </Input>
                {!!errors.total_seats && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.total_seats}
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
            <FormControl isInvalid={!!errors.start_location}>
              <LocationSearch
                onSelectLocation={(location) => {
                  if (setLocationFor.current === LocationFor.START_LOCATION) {
                    setstart_location(location);
                  } else {
                    setend_location(location);
                  }
                  setErrors({ ...errors, start_location: "" });
                  setLocationModal(false);
                }}
              />
              <FormControlError>
                <FormControlErrorText>
                  {errors.start_location}
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
