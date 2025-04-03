import React from "react";
import { Input, InputField } from "./ui/input";
import { Pressable, StyleSheet } from "react-native";
import EyeIcon from "./icons/EyeIcon";
import HideIcon from "./icons/HideIcon";

const PasswordInput: React.FC<{
  password: string;
  setPassword?: (_: string) => any;
  setErrorPassword?: (_: string) => any;
}> = ({ password, setPassword, setErrorPassword }) => {
  const [isHide, setIsHide] = React.useState<boolean>(true);
  return (
    <Input variant="outline" size="md" className="h-[45px]">
      <InputField
        placeholder="Nhập mật khẩu"
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          setErrorPassword?.("");
        }}
        secureTextEntry={isHide}
      />
      <Pressable onPress={() => setIsHide(!isHide)} style={styles.eyesBtn}>
        {isHide ? (
          <EyeIcon size={24} color={"#000"} />
        ) : (
          <HideIcon size={24} color={"#000"} />
        )}
      </Pressable>
    </Input>
  );
};

export default PasswordInput;

const styles = StyleSheet.create({
  eyesBtn: {
    marginRight: 2,
    width: 50,
    alignItems: "center",
  },
});
