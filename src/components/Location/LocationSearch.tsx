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
import { InputLocation } from "../../types";
import useDebounce from "@/hooks/useDebounce";

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

  const debounce = useDebounce({ time: 500 });

  React.useEffect(() => {
    debounce(async () => {
      if (query.length > 2) {
        setIsLoading(true);
        try {
          const response = await fetch(
            `https://photon.komoot.io/api?q=${encodeURIComponent(
              query
            )},Việt Nam`
          );
          const data = await response.json();
          setResults(
            data.features.map((v) => ({
              display_name: [
                v?.properties?.name,
                v?.properties?.street,
                v?.properties?.locality,
                v?.properties?.district,
                v?.properties?.city,
                v?.properties?.country,
              ]
                .filter((v) => !!v)
                .join(", "),
              lat: v.geometry.coordinates[1],
              lon: v.geometry.coordinates[1],
            })).filter((v, i) => i < 5)
          );
        } catch (error) {
          console.error("Error fetching locations:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    });
  }, [query]);

  return (
    <Box>
      <Input className="h-[55px] rounded-lg">
        <InputField
          placeholder="Tìm kiếm"
          value={query}
          onChangeText={setQuery}
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
