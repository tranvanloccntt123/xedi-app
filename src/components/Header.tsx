import React from "react";
import { HStack } from "@/src/components/ui/hstack";
import { Button } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import ChevronLeftIcon from "./icons/ChevronLeftIcon";
import { router } from "expo-router";

const Header: React.FC<{
  title: string;
  onBack?: () => any;
  rightComponent?: React.ReactNode;
}> = ({ title, rightComponent, onBack }) => {
  return (
    <HStack space="sm" className="items-center mb-6">
      {router.canGoBack() && (
        <Button variant="link" onPress={onBack || router.back}>
          <ChevronLeftIcon size={24} color="#000000" />
        </Button>
      )}
      <Heading size="xl" className="flex-1">
        {title}
      </Heading>
      {!!rightComponent && rightComponent}
    </HStack>
  );
};

export default Header;
