import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Box } from "@/src/components/ui/box";
import { Input } from "@/src/components/ui/input";
import { InputField } from "@/src/components/ui/input";
import { VStack } from "@/src/components/ui/vstack";
import { Text } from "@/src/components/ui/text";
import { Pressable } from "@/src/components/ui/pressable";
import useDebounce from "@/hooks/useDebounce";

interface Location {
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationSearchProps {
  onSelectLocation: (location: Location) => void;
}

export default function LocationSearch({
  onSelectLocation,
}: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounce = useDebounce({ time: 400 });

  const searchLocation = async (text: string) => {
    setQuery(text);
  };

  useEffect(() => {
    if (query.length > 2) {
      debounce(async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              query
            )}`
          );
          const data = await response.json();
          setResults(data);
        } catch (error) {
          console.error("Error fetching locations:", error);
        } finally {
          setIsLoading(false);
        }
      });
    }
  }, [query]);

  return (
    <Box>
      <Input>
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
