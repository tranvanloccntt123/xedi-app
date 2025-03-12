import React from "react";
import { HStack } from "@/src/components/ui/hstack";
import { Button } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import ChevronLeftIcon from "./icons/ChevronLeftIcon";
import { router } from "expo-router";
import { VStack } from "./ui/vstack";
import { Text } from "./ui/text";

const Header: React.FC<{
  title: string;
  subTitle?: string;
  onBack?: () => any;
  rightComponent?: React.ReactNode;
}> = ({ title, rightComponent, onBack, subTitle }) => {
  return (
    <HStack space="sm" className="items-center mb-6">
      {router.canGoBack() && (
        <Button variant="link" onPress={onBack || router.back}>
          <ChevronLeftIcon size={24} color="#000000" />
        </Button>
      )}
      <VStack space="sm" className="flex-1">
        <Heading size={subTitle ? "sm" : "xl"} className="flex-1">
          {title}
        </Heading>
        {!!subTitle && <Text className="text-xs text-black">{subTitle}</Text>}
      </VStack>
      {!!rightComponent && rightComponent}
    </HStack>
  );
};

export default Header;
