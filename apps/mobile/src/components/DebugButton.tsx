import React from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const usePositionXY = (initX: number, initY: number) => {
  const x = useSharedValue(initX);
  const y = useSharedValue(initY);
  const save = (newParams: { x: number; y: number }) => {
    x.value = newParams.x;
    y.value = newParams.y;
  };
  return { x, y, save };
};

const DebugButton: React.FC<{ onPress?: () => any }> = ({ onPress }) => {
  const translate = usePositionXY(0, 0);
  const prevTranslate = usePositionXY(0, 0);
  const isDebug = useSharedValue(false);
  const pan = Gesture.Pan()
    .onStart(() => {
      prevTranslate.save({ x: translate.x.value, y: translate.y.value });
    })
    .onUpdate((event) => {
      translate.save({
        x: prevTranslate.x.value + event.translationX,
        y: prevTranslate.y.value + event.translationY,
      });
    })
    .runOnJS(true);
  const tap = Gesture.Tap()
    .onEnd(() => {
      onPress?.();
      isDebug.value = !isDebug.value;
    })
    .runOnJS(true);
  const race = Gesture.Simultaneous(pan, tap);

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translate.x.value,
        },
        {
          translateY: translate.y.value,
        },
      ],
    } as never;
  });

  return (
    <GestureDetector gesture={race}>
      <Animated.View
        style={[
          {
            position: "absolute",
            zIndex: 9999,
            bottom: 50,
            left: 15,
            width: 50,
            height: 50,
            padding: 5,
            borderColor: "rgba(255, 255, 255, 0.3)",
            borderWidth: 2,
            borderRadius: 1000,
          },
          containerStyle,
        ]}
      >
        <View
          style={{
            flex: 1,
            borderRadius: 1000,
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            borderWidth: 1,
            borderColor: "rgba(0, 0, 0, 0.5)",
          }}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default DebugButton;
