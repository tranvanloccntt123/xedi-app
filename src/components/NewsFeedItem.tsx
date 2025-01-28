import React from "react"
import type { IFixedRoute, INewsFeedItem, ITripRequest } from "@/src/types"
import moment from "moment"
import { Box } from "./ui/box"
import { VStack } from "./ui/vstack"
import { HStack } from "./ui/hstack"
import { Text } from "./ui/text"

interface NewsFeedItemProps {
  item: INewsFeedItem
}

const NewsFeedItem: React.FC<NewsFeedItemProps> = ({ item }) => {
  return (
    <Box className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <VStack space="sm">
        <HStack className="justify-between items-center">
          <Text className="font-bold">{item.author.name}</Text>
          <Text className="text-gray-500 text-sm">{moment(item.createdAt).fromNow()}</Text>
        </HStack>
        <Text>{item.content}</Text>
        <Box className="bg-gray-100 p-2 rounded">
          <Text className="font-semibold">{item.tripInfo.type === "fixedRoute" ? "Fixed Route" : "Trip Request"}</Text>
          <Text>
            {item.tripInfo.type === "fixedRoute"
              ? `From: ${(item.tripInfo.data as IFixedRoute).startLocation} To: ${(item.tripInfo.data as IFixedRoute).endLocation}`
              : `From: ${(item.tripInfo.data as ITripRequest).startLocation} To: ${(item.tripInfo.data as ITripRequest).endLocation}`}
          </Text>
        </Box>
        <Text className="text-sm text-gray-500">
          Location: {item.location.latitude.toFixed(6)}, {item.location.longitude.toFixed(6)}
        </Text>
      </VStack>
    </Box>
  )
}

export default NewsFeedItem

