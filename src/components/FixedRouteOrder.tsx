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
import { IFixedRoute, IUser } from "../types";
import { xediSupabase } from "../lib/supabase";
import { Heading } from "./ui/heading";

const FixedRouteOrder: React.FC<{
  user: IUser;
  fixedRoute: IFixedRoute;
  visible: boolean;
  onClose: () => any;
}> = ({ user, fixedRoute, visible, onClose }) => {
  const [note, setNote] = React.useState("");
  const [name, setName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const handleOrder = async () => {
    if (!user || !fixedRoute) return;

    try {
      const { data, error } = await xediSupabase.tables.fixedRouteOrders.add([
        {
          fixed_route_id: fixedRoute.id,
          user_id: user.id,
          name,
          phone_number: phoneNumber,
          note,
        },
      ]);

      if (error) throw error;

      // Show success message and reset form
      // You might want to use a toast or alert here
      console.log("Order placed successfully");
      setName("");
      setPhoneNumber("");
      setNote("");
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
          <Heading>Yêu cầu chuyến đi</Heading>
        </ModalHeader>
        <ModalBody>
          <VStack space="md" className="rounded-sm">
            <Input>
              <InputField
                placeholder="Tên"
                value={name}
                onChangeText={setName}
              />
            </Input>
            <Input>
              <InputField
                placeholder="Số điện thoại"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </Input>
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
              <ButtonText>Đặt chuyến</ButtonText>
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FixedRouteOrder;
