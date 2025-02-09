import { useState } from "react"
import { ActivityIndicator } from "react-native"
import { Box } from "@/src/components/ui/box"
import { Input } from "@/src/components/ui/input"
import { InputField } from "@/src/components/ui/input"
import { VStack } from "@/src/components/ui/vstack"
import { Text } from "@/src/components/ui/text"
import { Pressable } from "@/src/components/ui/pressable"

interface Location {
  display_name: string
  lat: string
  lon: string
}

interface LocationSearchProps {
  onSelectLocation: (location: Location) => void
}

export default function LocationSearch({ onSelectLocation }: LocationSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const searchLocation = async (text: string) => {
    setQuery(text)
    if (text.length > 2) {
      setIsLoading(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}`,
        )
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error("Error fetching locations:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      setResults([])
    }
  }

  return (
    <Box>
      <Input>
        <InputField placeholder="Search for a location" value={query} onChangeText={searchLocation} />
      </Input>
      {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
      <VStack space="sm" className="mt-2">
        {results.map((item, index) => (
          <Pressable key={index} onPress={() => onSelectLocation(item)} className="p-2 bg-white rounded-md">
            <Text>{item.display_name}</Text>
          </Pressable>
        ))}
      </VStack>
    </Box>
  )
}

