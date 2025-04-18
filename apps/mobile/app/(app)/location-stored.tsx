import React from "react";
import { Box } from "@/src/components/ui/box";
import { SafeAreaView } from "react-native-safe-area-context";
import AppStyles, { wrapTextStyle } from "@/src/theme/AppStyles";
import Header from "@/src/components/Header";
import useQuery from "@/hooks/useQuery";
import { XEDI_QUERY_KEY } from "@/src/store/fetchServices/fetchServicesSlice";
import { xediSupabase } from "@/src/lib/supabase";
import { FlatList, RefreshControl, Text } from "react-native";
import { VStack } from "@/src/components/ui/vstack";
import { splitLocation } from "@/src/utils";
import AppColors from "@/src/constants/colors";
import { Divider } from "@/src/components/ui/divider";
import { Button, ButtonText } from "@/src/components/ui/button";
import AddIcon from "@/src/components/icons/AddIcon";
import { scale, ScaledSheet } from "react-native-size-matters";
import { router } from "expo-router";
import LocationIcon from "@/src/components/icons/LocationIcon";
import { HStack } from "@/src/components/ui/hstack";
import TrashIcon from "@/src/components/icons/TrashIcon";
import ConfirmationModal from "@/src/components/Location/ConfirmationModal";

const LocationStoredItem: React.FC<{
  item: IUserLocationStore;
  onTrashPress?: () => any;
}> = ({ item, onTrashPress }) => {
  const { title, subTitle } = React.useMemo(
    () =>
      !!item?.location?.display_name
        ? splitLocation(item?.location?.display_name)
        : { title: "", subTitle: "" },
    [item]
  );
  return (
    <Box className="">
      <HStack className="px-[16px] py-[12px] items-center" space="md">
        <LocationIcon size={scale(15)} color={AppColors.warning} />
        <VStack space="xs" className="flex-1">
          <Text
            style={[
              wrapTextStyle({ fontWeight: "700", color: AppColors.text }, "sm"),
            ]}
          >
            {title}
          </Text>
          {!!subTitle && (
            <Text
              style={[
                wrapTextStyle(
                  { fontWeight: "500", color: AppColors.text, opacity: 0.8 },
                  "2xs"
                ),
              ]}
            >
              {subTitle}
            </Text>
          )}
        </VStack>
        <Button onPress={onTrashPress} action="default">
          <TrashIcon size={scale(18)} color={AppColors.error} />
        </Button>
      </HStack>
      <Divider />
    </Box>
  );
};

export default function LocationStored() {
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [locationSelected, setLocationSelected] =
    React.useState<IUserLocationStore>();
  const { refetch, data } = useQuery({
    queryKey: XEDI_QUERY_KEY.YOUR_LOCATIONS_STORED,
    async queryFn() {
      const { data } =
        await xediSupabase.tables.userLocationStore.selectByUserIdAfterDate({
          pageNums: 4,
        });
      return data || [];
    },
  });

  const refresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(async () => {
      await refetch();
      setIsRefreshing(false);
    }, 100);
  };

  const renderItem = React.useCallback(
    ({ item, index }: { item: IUserLocationStore; index: number }) => {
      return (
        <LocationStoredItem
          item={item}
          onTrashPress={() => {
            setLocationSelected(item);
            setShowConfirmationModal(true);
          }}
        />
      );
    },
    [data]
  );

  return (
    <Box className="flex-1 bg-xedi-background">
      <SafeAreaView style={AppStyles.container}>
        <Header title="Địa chỉ đã lưu" className="px-[16px]" />
        <Box className="flex-1">
          <FlatList
            data={data || []}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
            }
            ListFooterComponent={
              data.length < 4 && (
                <Button
                  variant="link"
                  onPress={() => router.navigate("/add-location")}
                  style={styles.locationBtn}
                  className="px-[16px]"
                >
                  <AddIcon size={scale(15)} color={AppColors.primary} />
                  <ButtonText
                    style={wrapTextStyle({ fontWeight: "700" }, "sm")}
                  >
                    Thêm điểm đón
                  </ButtonText>
                </Button>
              )
            }
          />
        </Box>
      </SafeAreaView>
      <ConfirmationModal
        location={locationSelected?.location}
        showConfirmationModal={showConfirmationModal}
        setShowConfirmationModal={setShowConfirmationModal}
        onConfirm={() => {
          xediSupabase.tables.userLocationStore
            .deleteById(locationSelected.id)
            .then(({ data, error }) => {
              if (!error) {
                refetch();
              }
            });
        }}
      />
    </Box>
  );
}

const styles = ScaledSheet.create({
  locationBtn: {
    height: "35@vs",
    justifyContent: "flex-start",
  },
});
