import React from "react";
import { Box } from "./ui/box";
import { Text } from "react-native";
import { ScaledSheet } from "react-native-size-matters";
import AppColors from "../constants/colors";
import { wrapTextStyle } from "../theme/AppStyles";

const FormError: React.FC<{ children: any }> = ({ children }) => {
  return (
    <Box>
      <Text style={[wrapTextStyle({ fontWeight: "500" }, "2xs"), styles.txt]}>
        {children}
      </Text>
    </Box>
  );
};

export default FormError;

const styles = ScaledSheet.create({
  txt: {
    color: AppColors.error,
  },
});
