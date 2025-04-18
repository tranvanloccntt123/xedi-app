import { scale, ScaledSheet, TextStyle } from "react-native-size-matters";

import {
  Inter_100Thin,
  Inter_100Thin_Italic,
  Inter_200ExtraLight,
  Inter_200ExtraLight_Italic,
  Inter_300Light,
  Inter_300Light_Italic,
  Inter_400Regular,
  Inter_400Regular_Italic,
  Inter_500Medium,
  Inter_500Medium_Italic,
  Inter_600SemiBold,
  Inter_600SemiBold_Italic,
  Inter_700Bold,
  Inter_700Bold_Italic,
  Inter_800ExtraBold,
  Inter_800ExtraBold_Italic,
  Inter_900Black,
  Inter_900Black_Italic,
} from "@expo-google-fonts/inter";

import { StyleProp } from "react-native";
import AppColors from "../constants/colors";

const AppStyles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
    height: "45@vs",
  },
  primaryBtn: {
    height: "35@vs",
    backgroundColor: AppColors.primary,
  },
  cancelBtn: {
    height: "35@vs",
    backgroundColor: AppColors.placeholder,
  },
  inp: {
    height: "35@vs",
  },
});

export const XediFonts: XediFont = {
  Inter_100Thin: Inter_100Thin,
  Inter_100Thin_Italic: Inter_100Thin_Italic,
  Inter_200ExtraLight: Inter_200ExtraLight,
  Inter_200ExtraLight_Italic: Inter_200ExtraLight_Italic,
  Inter_300Light: Inter_300Light,
  Inter_300Light_Italic: Inter_300Light_Italic,
  Inter_400Regular: Inter_400Regular,
  Inter_400Regular_Italic: Inter_400Regular_Italic,
  Inter_500Medium: Inter_500Medium,
  Inter_500Medium_Italic: Inter_500Medium_Italic,
  Inter_600SemiBold: Inter_600SemiBold,
  Inter_600SemiBold_Italic: Inter_600SemiBold_Italic,
  Inter_700Bold: Inter_700Bold,
  Inter_700Bold_Italic: Inter_700Bold_Italic,
  Inter_800ExtraBold: Inter_800ExtraBold,
  Inter_800ExtraBold_Italic: Inter_800ExtraBold_Italic,
  Inter_900Black: Inter_900Black,
  Inter_900Black_Italic: Inter_900Black_Italic,
};

export const xediFontSize = {
  xs: scale(9),
  "2xs": scale(10),
  sm: scale(13),
  md: scale(15),
  lg: scale(18),
  xl: scale(22),
  "2xl": scale(28),
};

export const getFontWeight = (fontWeight: XediFontWeight): XediFontWeight => {
  switch (fontWeight) {
    case "200":
      return "200";
    case "300":
      return "300";
    case "400":
      return "400";
    case "500":
      return "500";
    case "600":
      return "600";
    case "700":
      return "700";
    default:
      return "700";
  }
};

type Fonts = keyof XediFont;

const fontNormal: Record<XediFontWeight, keyof XediFont> = {
  "100": "Inter_100Thin",
  "200": "Inter_200ExtraLight",
  "300": "Inter_300Light",
  "400": "Inter_400Regular",
  "500": "Inter_500Medium",
  "600": "Inter_600SemiBold",
  "700": "Inter_700Bold",
  "800": "Inter_800ExtraBold",
  "900": "Inter_900Black",
};

const fontItalic: Record<XediFontWeight, keyof XediFont> = {
  "100": "Inter_100Thin_Italic",
  "200": "Inter_200ExtraLight_Italic",
  "300": "Inter_300Light_Italic",
  "400": "Inter_400Regular_Italic",
  "500": "Inter_500Medium_Italic",
  "600": "Inter_600SemiBold_Italic",
  "700": "Inter_700Bold_Italic",
  "800": "Inter_800ExtraBold_Italic",
  "900": "Inter_900Black_Italic",
};

export const getFontFamily = (
  fontWeight: XediFontWeight,
  isItalic: boolean = false
): Fonts => {
  if (isItalic) {
    return fontItalic[fontWeight];
  }
  return fontNormal[fontWeight];
};

export const wrapTextStyle = (
  style: TextStyle,
  _fontSize: XediFontSize = "sm"
): StyleProp<any> => {
  const fontWeight: XediFontWeight = getFontWeight(
    (style.fontWeight as XediFontWeight) ?? "400"
  );
  const fontSize = xediFontSize[_fontSize];
  const fontFamily = getFontFamily(fontWeight, style?.fontStyle === "italic");
  return {
    // color: AppColors.text,
    ...style,
    fontSize,
    fontFamily,
  };
};

export default AppStyles;
