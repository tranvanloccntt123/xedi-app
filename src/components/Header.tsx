import React from "react";
import { Box } from "@/src/components/ui/box";
import { Text } from "@/src/components/ui/text";
import { Button } from "@/src/components/ui/button";
import { HStack } from "@/src/components/ui/hstack";
import { VStack } from "@/src/components/ui/vstack";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onBack }) => {
  const insets = useSafeAreaInsets();

  return (
    <Box
      className="bg-white w-full border-b border-gray-200"
      style={{ paddingTop: insets.top }}
    >
      <HStack className="items-center justify-between px-4 py-2">
        {onBack ? (
          <Button onPress={onBack} variant="link" className="p-2">
            <Ionicons name="arrow-back" size={24} color="black" />
          </Button>
        ) : (
          <Box className="w-10" /> // Placeholder for alignment
        )}
        <VStack className="items-center flex-1">
          <Text className="text-xl font-bold text-gray-800">{title}</Text>
          {!!subtitle && (
            <Text className="text-sm text-gray-600">{subtitle}</Text>
          )}
        </VStack>
        <Box className="w-10" />
      </HStack>
    </Box>
  );
};
