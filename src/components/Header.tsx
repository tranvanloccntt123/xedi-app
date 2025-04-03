import React from "react";
import { HStack } from "@/src/components/ui/hstack";
import { Button } from "@/src/components/ui/button";
import ChevronLeftIcon from "./icons/ChevronLeftIcon";
import { router } from "expo-router";
import { VStack } from "./ui/vstack";
import { wrapTextStyle } from "../theme/AppStyles";
import { Text } from "react-native";

const Header: React.FC<{
  title: string;
  subTitle?: string;
  onBack?: () => any;
  rightComponent?: React.ReactNode;
}> = ({ title, rightComponent, onBack, subTitle }) => {
  return (
    <VStack className="mb-6">
      <HStack space="sm" className="items-center">
        {router.canGoBack() && (
          <Button variant="link" onPress={onBack || router.back}>
            <ChevronLeftIcon size={24} color="#000000" />
          </Button>
        )}
        <VStack className="flex-1">
          <Text style={wrapTextStyle({ fontWeight: "700" }, "sm")}>
            {title}
          </Text>
          {!!subTitle && (
            <Text
              style={wrapTextStyle({ fontWeight: "400", opacity: 0.5 }, "2xs")}
            >
              {subTitle}
            </Text>
          )}
        </VStack>
        {!!rightComponent && rightComponent}
      </HStack>
    </VStack>
  );
};

export default Header;
