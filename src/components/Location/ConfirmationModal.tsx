import React from "react";
import { Box } from "@/src/components/ui/box";
import { Text } from "react-native";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@/src/components/ui/modal";
import { Button, ButtonText } from "@/src/components/ui/button";
import AppStyles, { wrapTextStyle } from "@/src/theme/AppStyles";
import AppColors from "@/src/constants/colors";
import { Divider } from "@/src/components/ui/divider";
import { VStack } from "@/src/components/ui/vstack";
import { ScaledSheet } from "react-native-size-matters";
import { splitLocation } from "@/src/utils";
import { xediSupabase } from "@/src/lib/supabase";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";

const ConfirmationModal: React.FC<{
  location?: InputLocation;
  showConfirmationModal: boolean;
  setShowConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm?: () => any;
}> = ({
  showConfirmationModal,
  setShowConfirmationModal,
  location,
  onConfirm,
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { title, subTitle } = React.useMemo(
    () =>
      !!location?.display_name
        ? splitLocation(location.display_name)
        : { title: "", subTitle: "" },
    [location]
  );
  return (
    <Modal
      isOpen={showConfirmationModal}
      onClose={() => {
        setShowConfirmationModal(false);
      }}
    >
      <ModalBackdrop />
      <ModalContent className="max-w-xl bg-xedi-background">
        <ModalBody className="mb-5">
          <Box className="py-[16px]">
            <Text style={styles.title}>Xác nhận thêm địa chỉ</Text>
          </Box>
          <Divider />
          <VStack className="py-[16px]">
            <Text style={styles.locationTitle}>{title}</Text>
            <Text style={styles.locationSubTitle}>{subTitle}</Text>
          </VStack>
        </ModalBody>
        <ModalFooter className="w-full">
          <Button
            onPress={() => {
              setShowConfirmationModal(false);
            }}
            action="default"
            className="flex-grow"
            style={AppStyles.cancelBtn}
          >
            <ButtonText
              style={wrapTextStyle(
                { fontWeight: "500", color: AppColors.white },
                "2xs"
              )}
            >
              Quay lại
            </ButtonText>
          </Button>
          <Button
            onPress={() => {
              setShowConfirmationModal(false);
              xediSupabase.tables.userLocationStore
                .add([
                  {
                    user_id: user.id,
                    location: location,
                  },
                ])
                .then((response) => {
                  const { data } = response;
                  if (!!data) {
                    onConfirm?.();
                  }
                });
            }}
            action="default"
            className="flex-grow"
            style={AppStyles.primaryBtn}
          >
            <ButtonText
              style={wrapTextStyle(
                { fontWeight: "500", color: AppColors.white },
                "2xs"
              )}
            >
              Xác nhận
            </ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const styles = ScaledSheet.create({
  title: {
    ...wrapTextStyle({ fontWeight: "700" }, "sm"),
    color: AppColors.text,
  },
  locationTitle: {
    ...wrapTextStyle({ fontWeight: "700" }, "2xs"),
    color: AppColors.text,
  },
  locationSubTitle: {
    ...wrapTextStyle({ fontWeight: "500" }, "2xs"),
    color: AppColors.text,
    opacity: 0.8,
  },
});

export default ConfirmationModal;
