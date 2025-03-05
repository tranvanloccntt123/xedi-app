const APP_STRUCT = "CHAT_SCREEN";

import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { Box } from "@/src/components/ui/box";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { InputField } from "@/src/components/ui/input";
import { Modal } from "@/src/components/ui/modal";
import { ModalBackdrop } from "@/src/components/ui/modal";
import { ModalContent } from "@/src/components/ui/modal";
import { ModalHeader } from "@/src/components/ui/modal";
import { ModalCloseButton } from "@/src/components/ui/modal";
import { ModalBody } from "@/src/components/ui/modal";
import { ModalFooter } from "@/src/components/ui/modal";
import { Heading } from "@/src/components/ui/heading";
import { VStack } from "@/src/components/ui/vstack";
import { useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import ChatInput from "@/src/components/ChatInput";

// Mock chat messages for demonstration
const mockMessages: IMessage[] = [
  {
    _id: 2,
    text: "Cảm ơn bạn! Bạn có thể cho tôi biết thời gian đón được không?",
    createdAt: new Date(),
    user: {
      _id: "customer1",
      name: "Khách hàng",
    },
  },
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<IMessage[]>(mockMessages);
  const [showModal, setShowModal] = useState(false);
  const [price, setPrice] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Here you would typically fetch messages from your backend
    // For now, we're using mock data
    setMessages(mockMessages);
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
    // Here you would typically send the message to your backend
  }, []);

  const handleOrderTripRequest = () => {
    // Here you would typically send the order to your backend
    console.log(`Order trip request with price: ${price}`);
    setShowModal(false);

    // Send a message to the chat thread
    onSend([
      {
        _id: Math.round(Math.random() * 1000000),
        text: `Tài xế báo giá chuyến đi: ${price} VND`,
        createdAt: new Date(),
        user: {
          _id: user?.id || "",
          name: user?.name || "",
        },
      },
    ]);

    setPrice("");
  };

  const handleSendMessage = (text: string) => {
    onSend([
      {
        _id: Math.round(Math.random() * 1000000),
        text,
        createdAt: new Date(),
        user: {
          _id: user?.id || "",
          name: user?.name || "",
        },
      },
    ]);
  };

  return (
    <Box className="flex-1 bg-gray-100">
      {user?.role === "driver" && (
        <Box className="bg-white">
          <Button
            onPress={() => setShowModal(true)}
            className="my-2 mx-4 bg-blue-500"
          >
            <ButtonText>Báo giá</ButtonText>
          </Button>
        </Box>
      )}
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user?.id || "",
          name: user?.name || "",
        }}
        renderInputToolbar={() => null}
        renderAvatar={null}
        showUserAvatar={false}
        renderUsernameOnMessage={true}
        showAvatarForEveryMessage={false}
        renderAvatarOnTop={true}
        alwaysShowSend={true}
        scrollToBottom={true}
        inverted={true}
      />
      <ChatInput onSend={handleSendMessage} />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Đặt giá chuyến đi</Heading>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <VStack space="md">
              <Input>
                <InputField
                  placeholder="Nhập giá (VND)"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </Input>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onPress={() => setShowModal(false)}>
              <ButtonText>Hủy</ButtonText>
            </Button>
            <Button onPress={handleOrderTripRequest}>
              <ButtonText>Xác nhận</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

