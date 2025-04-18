import React from "react";
import { Box } from "@/src/components/ui/box";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { Icon, TrashIcon } from "@/src/components/ui/icon";
import {
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
} from "@/src/components/ui/modal";
import { Text } from "@/src/components/ui/text";
import ErrorIcon from "./icons/ErrorIcon";

const ErrorModal: React.FC<{
  showModal: boolean;
  setShowModal: (_: boolean) => any;
  title: string;
  message?: string;
}> = ({ setShowModal, showModal, title, message }) => {
  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
      }}
    >
      <ModalBackdrop />
      <ModalContent className="max-w-[305px] items-center">
        <ModalHeader>
          <Box className="w-[56px] h-[56px] rounded-full bg-background-error items-center justify-center mb-4">
            <ErrorIcon size={75} color="#b8213f" />
          </Box>
        </ModalHeader>
        <ModalBody className="mt-0 mb-4">
          <Heading size="md" className="text-typography-950 mb-2 text-center">
            {title}
          </Heading>
          {!!message && (
            <Text size="sm" className="text-typography-500 text-center">
              {message}
            </Text>
          )}
        </ModalBody>
        <ModalFooter className="w-full">
          <Button
            onPress={() => {
              setShowModal(false);
            }}
            size="sm"
            className="flex-grow"
          >
            <ButtonText>Xác nhận</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ErrorModal;
