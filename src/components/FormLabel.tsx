import React from "react";
import { Text } from "react-native";
import { Box } from "./ui/box";
import { wrapTextStyle } from "../theme/AppStyles";
import { ScaledSheet } from "react-native-size-matters";
import AppColors from "../constants/colors";

const FormLabel: React.FC<{ children: any }> = ({ children }) => {
  return (
    <Box className="mb-1">
      <Text style={[wrapTextStyle({ fontWeight: "600" }, "2xs"), styles.txt]}>
        {children}
      </Text>
    </Box>
  );
};

export default FormLabel;

const styles = ScaledSheet.create({
  txt: {
    opacity: 0.8,
    color: AppColors.text,
  },
});
