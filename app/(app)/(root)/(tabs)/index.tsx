const APP_STRUCT = "HOME_SCREEN"

import React from "react"
import { Box } from "@/src/components/ui/box"
import { Heading } from "@/src/components/ui/heading"
import { VStack } from "@/src/components/ui/vstack"
import { useSelector } from "react-redux"
import type { RootState } from "@/src/store/store"
import { FlatList, RefreshControl } from "react-native"
import { Text } from "@/src/components/ui/text"
import NewsFeedItem from "@/src/components/NewsFeedItem"
import type { INewsFeedItem } from "@/src/types"
import { mockNewsFeed } from "@/src/mockData/newsFeed"

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user)
  const [refreshing, setRefreshing] = React.useState(false)
  const [newsFeed, setNewsFeed] = React.useState(mockNewsFeed)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    // Simulate a network request
    setTimeout(() => {
      setNewsFeed([...mockNewsFeed].reverse()) // Just reverse the order for demo purposes
      setRefreshing(false)
    }, 2000)
  }, [])

  const renderItem = ({ item }: { item: INewsFeedItem }) => <NewsFeedItem item={item} />

  return (
    <Box className="flex-1 bg-gray-100">
      <FlatList
        data={newsFeed}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <VStack space="md" className="p-4">
            <Heading size="lg">Xin Chào, {user?.name || user?.phone}</Heading>
            <Text className="text-gray-600 mb-4">Đây là bảng tin mới nhất của bạn. Kéo xuống để cập nhật.</Text>
          </VStack>
        }
        contentContainerStyle={{ paddingHorizontal: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </Box>
  )
}

