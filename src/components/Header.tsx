import React from "react";
import { HStack } from "@/src/components/ui/hstack";
import { Button } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import ChevronLeftIcon from "./icons/ChevronLeftIcon";
import { router } from "expo-router";
import { VStack } from "./ui/vstack";
import { Text } from "./ui/text";
import { wrapTextStyle } from "../theme/AppStyles";

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
        <VStack space="sm" className="flex-1 justify-center">
          <Heading style={wrapTextStyle({ fontWeight: "700" }, "sm")}>
            {title}
          </Heading>
        </VStack>
        {!!rightComponent && rightComponent}
      </HStack>
      {!!subTitle && (
        <Text
          className="text-md color-xedi-text opacity-80"
          style={wrapTextStyle({ fontWeight: "400", marginLeft: 30 }, "2xs")}
        >
          {subTitle}
        </Text>
      )}
    </VStack>
  );
};

export default Header;
