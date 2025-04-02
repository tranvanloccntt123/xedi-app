import { scale, ScaledSheet, TextStyle } from "react-native-size-matters";

import {
  Mali_200ExtraLight,
  Mali_200ExtraLight_Italic,
  Mali_300Light,
  Mali_300Light_Italic,
  Mali_400Regular,
  Mali_400Regular_Italic,
  Mali_500Medium,
  Mali_500Medium_Italic,
  Mali_600SemiBold,
  Mali_600SemiBold_Italic,
  Mali_700Bold,
  Mali_700Bold_Italic,
} from "@expo-google-fonts/mali";
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
});

export const XediFonts: XediFont = {
  Mali_200ExtraLight: Mali_200ExtraLight,
  Mali_200ExtraLight_Italic: Mali_200ExtraLight_Italic,
  Mali_300Light: Mali_300Light,
  Mali_300Light_Italic: Mali_300Light_Italic,
  Mali_400Regular: Mali_400Regular,
  Mali_400Regular_Italic: Mali_400Regular_Italic,
  Mali_500Medium: Mali_500Medium,
  Mali_500Medium_Italic: Mali_500Medium_Italic,
  Mali_600SemiBold: Mali_600SemiBold,
  Mali_600SemiBold_Italic: Mali_600SemiBold_Italic,
  Mali_700Bold: Mali_700Bold,
  Mali_700Bold_Italic: Mali_700Bold_Italic,
};

export const getFontSize = (fontSize: XediFontSize) => {
  const font: Record<XediFontSize, number> = {
    xs: scale(8),
    "2xs": scale(12),
    sm: scale(14),
    md: scale(16),
    lg: scale(20),
    xl: scale(24),
    "2xl": scale(28),
  };
  return font[fontSize];
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
  "200": "Mali_200ExtraLight",
  "300": "Mali_300Light",
  "400": "Mali_400Regular",
  "500": "Mali_500Medium",
  "600": "Mali_600SemiBold",
  "700": "Mali_700Bold",
};

const fontItalic: Record<XediFontWeight, keyof XediFont> = {
  "200": "Mali_200ExtraLight_Italic",
  "300": "Mali_300Light_Italic",
  "400": "Mali_400Regular_Italic",
  "500": "Mali_500Medium_Italic",
  "600": "Mali_600SemiBold_Italic",
  "700": "Mali_700Bold_Italic",
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
  const fontSize = getFontSize(_fontSize);
  const fontFamily = getFontFamily(fontWeight, style?.fontStyle === "italic");
  return {
    color: AppColors.text,
    ...style,
    fontSize,
    fontFamily,
  };
};

export default AppStyles;
