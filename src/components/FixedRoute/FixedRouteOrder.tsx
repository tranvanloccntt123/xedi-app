import React from "react";

import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/src/components/ui/modal";
import { VStack } from "@/src/components/ui/vstack";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { Input, InputField } from "@/src/components/ui/input";
import {
  Textarea as TextArea,
  TextareaInput as TextAreaInput,
} from "@/src/components/ui/textarea";
import { Heading } from "@/src/components/ui/heading";
import {
  formValidatePerField,
  formValidateSuccess,
} from "@/src/utils/validator";
import { fixedRouteOrderValidator } from "@/src/constants/validator";
import { Text } from "@/src/components/ui/text";
import { Box } from "@/src/components/ui/box";
/*

    try {
      const validateForm = formValidatePerField(authValidator, {
        phone,
        password,
      })
      setError({
        phone: validateForm.phone?.message || "",
        password: validateForm.password?.message || "",
      })
      if (!formValidateSuccess(validateForm)) {
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${phone}${pattern}`,
        password,
      })

      if (error) {
        setErrorMessage(error.message)
      }
    } catch (e) {
      console.error(e)
      setErrorMessage("An unexpected error occurred")
    }
*/

const FixedRouteOrder: React.FC<{
  user: IUser;
  fixedRouteId: any;
  visible: boolean;
  onClose: () => any;
  onSuccess: (data?: {
    name: string;
    phoneNumber: string;
    note: string;
  }) => any;
}> = ({ user, fixedRouteId, visible, onClose, onSuccess }) => {
  const [note, setNote] = React.useState("");
  const [name, setName] = React.useState(user.name);
  const [error, setError] = React.useState<FixedRouteOrderForm>({
    name: "",
    phone: "",
  });
  const [phoneNumber, setPhoneNumber] = React.useState(user.phone);

  const handleOrder = async () => {
    if (!user || !fixedRouteId) return;

    try {
      const validateForm = formValidatePerField(fixedRouteOrderValidator, {
        name,
        phone: phoneNumber,
      });

      setError({
        phone: validateForm.phone?.message || "",
        name: validateForm.name?.message || "",
      });

      if (!formValidateSuccess(validateForm)) {
        return;
      }

      // const { data, error } = await xediSupabase.tables.fixedRouteOrders.add([
      //   {
      //     fixed_route_id: fixedRouteId,
      //     user_id: user.id,
      //     name,
      //     phone_number: phoneNumber,
      //     note,
      //   },
      // ]);

      // if (error) throw error;

      // Show success message and reset form
      // You might want to use a toast or alert here
      console.log("Order placed successfully");
      setName("");
      setPhoneNumber("");
      setNote("");
      onSuccess?.({ name, phoneNumber, note });
      onClose?.();
    } catch (error) {
      console.error("Error placing order:", error);
      // Show error message
    }
  };

  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader className="mb-4">
          <Heading>Thông tin liên lạc</Heading>
        </ModalHeader>
        <ModalBody>
          <VStack space="md" className="rounded-sm">
            <Box>
              <Input className="h-[45px]">
                <InputField
                  placeholder="Tên"
                  value={name}
                  onChangeText={setName}
                />
              </Input>
              {!!error.name && (
                <Text className="text-red-500 text-sm mt-1">{error.name}</Text>
              )}
            </Box>
            <Box>
              <Input className="h-[45px]">
                <InputField
                  placeholder="Số điện thoại"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </Input>
              {!!error.phone && (
                <Text className="text-red-500 text-sm mt-1">{error.phone}</Text>
              )}
            </Box>
            <TextArea>
              <TextAreaInput
                placeholder="Ghi chú"
                value={note}
                onChangeText={setNote}
                textAlignVertical="top"
              />
            </TextArea>
            <Button
              className="rounded-md"
              size="xl"
              onPress={() => handleOrder()}
            >
              <ButtonText>Xác nhận</ButtonText>
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FixedRouteOrder;
