"use client";
import React from "react";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { Box } from "@/src/components/ui/box";
import { Input } from "@/src/components/ui/input";
import { InputField } from "@/src/components/ui/input";
import { VStack } from "@/src/components/ui/vstack";
import { Text } from "@/src/components/ui/text";
import { Pressable } from "@/src/components/ui/pressable";
import { InputLocation } from "../types";

interface LocationSearchProps {
  onSelectLocation: (location: InputLocation) => void;
  defaultLocation?: InputLocation;
}

export default function LocationSearch({
  onSelectLocation,
  defaultLocation,
}: LocationSearchProps) {
  // Initialize query with default location if it exists
  const [query, setQuery] = useState(defaultLocation?.display_name || "");
  const [results, setResults] = useState<InputLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchLocation = async (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            text
          )},Việt Nam`
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  return (
    <Box>
      <Input className="h-[55px] rounded-lg">
        <InputField
          placeholder="Tìm kiếm"
          value={query}
          onChangeText={searchLocation}
        />
      </Input>
      {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
      <VStack space="sm" className="mt-2">
        {results.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => onSelectLocation(item)}
            className="p-2 bg-white rounded-md"
          >
            <Text>{item.display_name}</Text>
          </Pressable>
        ))}
      </VStack>
    </Box>
  );
}
