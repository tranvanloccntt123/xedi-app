import React from "react";
import { HStack } from "./ui/hstack";
import { Button } from "./ui/button";
import { Heading } from "./ui/heading";
import ChevronLeftIcon from "./icons/ChevronLeftIcon";
import { router } from "expo-router";

const Header: React.FC<{ title: string; rightComponent?: React.ReactNode }> = ({
  title,
  rightComponent,
}) => {
  return (
    <HStack space="sm" className="items-center mb-6">
      {router.canGoBack() && (
        <Button variant="link" onPress={router.back}>
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
