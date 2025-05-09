import React from "react";
import { Box } from "../ui/box";
import InfinityList, { InfinityListMethods } from "../InfinityList";
import { xediSupabase } from "supabase-client";
import { ScrollView, TouchableOpacity } from "react-native";
import { HStack } from "../ui/hstack";
import { Button, ButtonText } from "../ui/button";
import CloseIcon from "../icons/CloseIcon";
import AppColors from "@/src/constants/colors";
import FixedRouteItem from "../FixedRoute/FixedRouteItem";
import { router } from "expo-router";
import { IFixedRouteStatus } from "@/src/types/enum";

const DriverFixedRouteList: React.FC<{
  statusFilter?: IFixedRouteStatus[];
}> = ({ statusFilter }) => {
  const listRef = React.useRef<InfinityListMethods>(null);
  const [firstRender, setIsFirstRender] = React.useState<boolean>(true);
  React.useEffect(() => {
    !firstRender && listRef.current.refresh();
    setIsFirstRender(false);
  }, [statusFilter, firstRender]);

  return (
    <Box className="flex-1 py-4">
      <InfinityList
        ref={listRef}
        renderItem={function (data: {
          item: IFixedRoute;
          index: number;
        }): React.ReactNode {
          return (
            <Box className="mb-4">
              <TouchableOpacity
                onPress={() => router.navigate(`fixed/${data.item.id}/detail`)}
              >
                <FixedRouteItem fixedRoute={data.item} disabled />
              </TouchableOpacity>
            </Box>
          );
        }}
        queryFn={async function (lastPage: any): Promise<any[]> {
          try {
            const { data } =
              await xediSupabase.tables.fixedRoutes.selectByUserIdAfterId({
                id: lastPage,
                select: `*`,
                filter: statusFilter.length === 1 && [
                  {
                    filed: "status",
                    filter: "eq",
                    data: statusFilter[0],
                  },
                ],
                orFilter: statusFilter.length > 1 && [
                  {
                    query: `${statusFilter
                      .map((filter) => `status.eq.${filter}`)
                      .join(",")}`,
                  },
                ],
              });

            return data as never;
          } catch (e) {
            console.log(e);
            return [];
          }
        }}
        getLastPageNumber={function (lastData: any[]) {
          return lastData?.[lastData.length - 1]?.id;
        }}
      />
    </Box>
  );
};

const DriverStatusButton: React.FC<{
  onPress?: () => any;
  title: string;
  isChecked;
}> = ({ title, isChecked, onPress }) => {
  return (
    <Button
      onPress={onPress}
      className={`rounded-full border-0 h-[25px] ${
        isChecked ? "bg-xedi-secondary" : "bg-xedi-background"
      }`}
      action="default"
    >
      <CloseIcon
        size={12}
        color={isChecked ? AppColors.text : AppColors.black}
      />
      <ButtonText
        className={`text-sm font-[400] ${
          isChecked ? "color-xedi-text" : "color-xedi-placeholder"
        }`}
      >
        {title}
      </ButtonText>
    </Button>
  );
};

const DriverFixedRoute: React.FC<object> = () => {
  const [isPending, setIsPending] = React.useState<boolean>(true);
  const [isRunning, setIsRunnning] = React.useState<boolean>(true);
  const [isFinished, setIsFinished] = React.useState<boolean>(true);
  const listStatusSelected: IFixedRouteStatus[] = React.useMemo(() => {
    let _arr: IFixedRouteStatus[] = [];
    if (isPending) {
      _arr.push(IFixedRouteStatus.PENDING);
    }
    if (isRunning) {
      _arr.push(IFixedRouteStatus.RUNNING);
    }
    if (isFinished) {
      _arr.push(IFixedRouteStatus.FINISHED);
    }
    return _arr;
  }, [isPending, isRunning, isFinished]);

  return (
    <Box className="flex-1">
      <Box>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack className="h-[55px] px-4 items-center" space="sm">
            <DriverStatusButton
              title="Đang đợi"
              isChecked={isPending}
              onPress={() => setIsPending(!isPending)}
            />
            <DriverStatusButton
              title="Đang chạy"
              isChecked={isRunning}
              onPress={() => setIsRunnning(!isRunning)}
            />
            <DriverStatusButton
              title="Hoàn thành"
              isChecked={isFinished}
              onPress={() => setIsFinished(!isFinished)}
            />
          </HStack>
        </ScrollView>
      </Box>
      <Box className="flex-1">
        <DriverFixedRouteList statusFilter={listStatusSelected} />
      </Box>
    </Box>
  );
};

export default DriverFixedRoute;
