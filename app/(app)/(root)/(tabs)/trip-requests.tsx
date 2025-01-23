const APP_STRUCT = "TRIP_REQUESTS_SCREEN"

import React from "react"
import { Box } from "@/src/components/ui/box"
import { Heading } from "@/src/components/ui/heading"
import { VStack } from "@/src/components/ui/vstack"
import TripRequestList from "@/src/components/TripRequestList"

export default function TripRequestsScreen() {
  return (
    <Box className="flex-1 bg-gray-100 py-2">
      <VStack space="md" className="w-full">
        <Heading size="lg" className="mb-1 mx-4">
          Khách yêu cầu
        </Heading>
        <Box className="flex-1 w-full">
          <TripRequestList />
        </Box>
      </VStack>
    </Box>
  )
}

