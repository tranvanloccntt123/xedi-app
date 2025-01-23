import React, { useCallback } from "react"
import { FlatList } from "react-native"
import { Box } from "@/src/components/ui/box"
import { Text } from "@/src/components/ui/text"
import { useSelector } from "react-redux"
import type { RootState } from "@/src/store/store"
import type { IFixedRoute } from "@/src/types"
import { Button } from "@/src/components/ui/button"
import { ButtonText } from "@/src/components/ui/button"
import { router } from "expo-router"
import FixedRouteItem from "./FixedRouteItem"
import moment from "moment"
import { Heading } from "./ui/heading"

const APP_STRUCT = "FIXED_ROUTES_LIST"

interface FixedRoutesListProps {
  searchQuery: string
}

export default function FixedRoutesList({ searchQuery }: FixedRoutesListProps) {
  const user = useSelector((state: RootState) => state.auth.user)
  const fixedRoutes = useSelector((state: RootState) => state.fixedRoutes.routes)

  const filteredRoutes = fixedRoutes.filter(
    (route) =>
      route.driverId === user?.id &&
      (route.startLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.endLocation.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const renderItem = useCallback(
    ({ item, index }: { item: IFixedRoute; index: number }) => {
      const month = moment(item.departureTime).format("MM/YYYY")
      const upMonth = index && moment(filteredRoutes[index - 1].departureTime).format("MM/YYYY")
      return (
        <Box className="px-4 mb-[15px] w-full">
          {(index === 0 || month !== upMonth) && (
            <Heading size="xs" className="mb-2 text-bold text-primary-600">
              Tháng {month}
            </Heading>
          )}
          <FixedRouteItem fixedRoute={item} />
        </Box>
      )
    },
    [filteredRoutes],
  )

  return (
    <Box className="w-full">
      <FlatList
        data={filteredRoutes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <Box className="w-full px-4">
            <Text className="text-center font-bold">
              Không tìm thấy tuyến cố định nào. Thêm một tuyến mới để bắt đầu!
            </Text>
            <Button size="sm" className="mt-4 bg-blue-500 w-full" onPress={() => router.push("/create-fixed-route")}>
              <ButtonText className="text-white">Thêm tuyến mới</ButtonText>
            </Button>
          </Box>
        )}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </Box>
  )
}

