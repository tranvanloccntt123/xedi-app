import React from "react";
import { HStack } from "../ui/hstack";
import useQuery from "@/hooks/useQuery";
import { XEDI_QUERY_KEY } from "@/src/store/fetchServices/fetchServicesSlice";
import { xediSupabase } from "@/src/lib/supabase";
import AddIcon from "../icons/AddIcon";
import AppColors from "../../constants/colors";
import { Button, ButtonText } from "../ui/button";
import { wrapTextStyle } from "@/src/theme/AppStyles";
import { scale, ScaledSheet } from "react-native-size-matters";
import { router } from "expo-router";
import LocationIcon from "../icons/LocationIcon";
import { Box } from "../ui/box";
import { ScrollView } from "react-native";
import lodash from "lodash";
import { useDispatch } from "react-redux";
import { resetPostWithStartLocation } from "@/src/store/postForm/postFormSlice";

const HomeListUserLocation: React.FC<object> = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useQuery({
    queryKey: XEDI_QUERY_KEY.YOUR_LOCATIONS_STORED,
    async queryFn() {
      const { data } =
        await xediSupabase.tables.userLocationStore.selectByUserIdAfterDate({
          pageNums: 4,
        });
      return data || [];
    },
  });
  return (
    <Box style={styles.container}>
      {!isLoading && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack space="lg" className="items-center">
            {data?.length < 4 && (
              <Button
                variant="link"
                onPress={() => router.navigate("/add-location")}
                style={styles.locationBtn}
              >
                <AddIcon size={scale(15)} color={AppColors.primary} />
                <ButtonText style={wrapTextStyle({ fontWeight: "400" }, "2xs")}>
                  Thêm điểm đón
                </ButtonText>
              </Button>
            )}
            {data?.map?.((userLocations) => (
              <Button
                key={userLocations.id}
                variant="link"
                onPress={() => {
                  dispatch(resetPostWithStartLocation(userLocations.location));
                  router.navigate("/trip/create?type=end-location");
                }}
                style={styles.locationBtn}
              >
                <LocationIcon size={scale(15)} color={AppColors.warning} />
                <ButtonText style={wrapTextStyle({ fontWeight: "400" }, "2xs")}>
                  {lodash.truncate(
                    userLocations?.location?.display_name || "",
                    {
                      length: 20,
                      omission: "...",
                    }
                  )}
                </ButtonText>
              </Button>
            ))}
          </HStack>
        </ScrollView>
      )}
    </Box>
  );
};

export default HomeListUserLocation;

const styles = ScaledSheet.create({
  container: {
    height: "30@vs",
    width: "100%",
  },
  locationBtn: {
    height: "30@vs",
  },
});
