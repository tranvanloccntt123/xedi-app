import React from "react";
import * as Updates from "expo-updates";
import { Box } from "./ui/box";
import Animated, {
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet } from "react-native";
import { Heading } from "./ui/heading";
import LottieView from "lottie-react-native";
import Lottie from "@/src/lottie";
import { HStack } from "./ui/hstack";
import { VStack } from "./ui/vstack";
import { Button, ButtonText } from "./ui/button";

const CheckUpdateModal: React.FC<object> = () => {
  const { isDownloading, isUpdateAvailable, isUpdatePending } =
    Updates.useUpdates();
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const modalAnim = useSharedValue(0);
  const lottieRef = React.useRef<LottieView>(null);
  React.useEffect(() => {
    Updates.checkForUpdateAsync();
  }, []);

  React.useEffect(() => {
    if (isUpdateAvailable) {
      setShowModal(true);
      modalAnim.value = withDelay(200, withTiming(1, { duration: 400 }));
    }
  }, [isUpdateAvailable]);

  return (
    showModal && (
      <Box className="absolute p-[20px] justify-center items-center top-0 right-0 left-0 bottom-0 bg-[#00000080]">
        <Animated.View style={styles.container}>
          <VStack space="lg">
            <Heading size="xl">Bản cập nhật mới đã sẵn sàng</Heading>
            <HStack>
              <LottieView
                ref={lottieRef}
                source={Lottie.UPDATE}
                colorFilters={[]}
                style={{ width: "100%", height: 150 }}
                loop
              />
            </HStack>
            {!isDownloading && (
              <HStack space="md">
                <Box className="flex-1">
                  <Button
                    onPress={() => setShowModal(false)}
                    className="bg-gray-400 border-0"
                  >
                    <ButtonText className="text-white">Đóng</ButtonText>
                  </Button>
                </Box>
                <Box className="flex-1">
                  <Button
                    onPress={() => {
                      lottieRef.current.play();
                      Updates.fetchUpdateAsync();
                    }}
                  >
                    <ButtonText>Cập nhật</ButtonText>
                  </Button>
                </Box>
              </HStack>
            )}
            {isUpdatePending && (
              <Button
                onPress={() => {
                  Updates.reloadAsync();
                  setShowModal(false);
                }}
              >
                <ButtonText>Khởi động lại ứng dụng</ButtonText>
              </Button>
            )}
          </VStack>
        </Animated.View>
      </Box>
    )
  );
};

export default CheckUpdateModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 20,
    borderRadius: 20,
  },
});
