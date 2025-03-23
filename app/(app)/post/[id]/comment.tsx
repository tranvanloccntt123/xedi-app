import React from "react";
import { Box } from "@/src/components/ui/box";
import AppStyles from "@/src/theme/AppStyles";
import { Heading } from "@/src/components/ui/heading";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/src/components/ui/button";
import CloseIcon from "@/src/components/icons/CloseIcon";
import { IconSize } from "@/src/theme/Size";
import { Divider } from "@/src/components/ui/divider";
import { router, useLocalSearchParams } from "expo-router";
import InfinityList, {
  InfinityListMethods,
} from "@/src/components/InfinityList";
import { IComment, INewsFeedItem } from "@/src/types";
import { xediSupabase } from "@/src/lib/supabase";
import { Tables } from "@/src/constants";
import { HStack } from "@/src/components/ui/hstack";
import { Avatar, AvatarFallbackText } from "@/src/components/ui/avatar";
import { VStack } from "@/src/components/ui/vstack";
import { Text } from "@/src/components/ui/text";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { Input, InputField } from "@/src/components/ui/input";
import SendComment from "@/src/components/icons/SendComment";
import moment from "moment";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  setFetchingData,
  XEDI_GROUP_INFO,
} from "@/src/store/fetchServices/fetchServicesSlice";
import { useDataInfo } from "@/hooks/useQuery";
import LottieView from "lottie-react-native";
import Lottie from "@/src/lottie";

const CommentInput: React.FC<{
  onSendComment: (comment: IComment) => any;
}> = ({ onSendComment }) => {
  const { id } = useLocalSearchParams();
  const sendBtnAnim = useSharedValue(0);
  const user = useSelector((state: RootState) => state.auth.user);
  const [comment, setComment] = React.useState("");
  const handleSubmitComment = async () => {
    try {
      const { data } = await xediSupabase.tables.comments.add([
        {
          content: comment,
          user_id: user.id,
          feed_id: id,
        },
      ]);

      if (!!data.length) {
        onSendComment?.({ ...data[0], users: user });
      }
      setComment("");
    } catch (e) {}
  };
  React.useEffect(() => {
    sendBtnAnim.value = withTiming(comment === "" ? 0 : 1, { duration: 100 });
  }, [comment]);
  const sendBtnContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: sendBtnAnim.value,
    };
  });

  return (
    <HStack space="md" className="p-[16px]">
      <Avatar size="md">
        <AvatarFallbackText>{user?.name || "XeDi"}</AvatarFallbackText>
      </Avatar>
      <Input className="flex-1 h-[45px] text-lg border-0">
        <InputField
          value={comment}
          onChangeText={setComment}
          className="text-lg"
          placeholder="Gửi bình luận"
        />
      </Input>
      <Animated.View style={[{ opacity: 0 }, sendBtnContainerStyle]}>
        <Button
          onPress={handleSubmitComment}
          className="h-[45px] rounded-full"
          isDisabled={comment.trim() === ""}
        >
          <SendComment size={IconSize.md} color="#fff" />
        </Button>
      </Animated.View>
    </HStack>
  );
};

export default function Comment() {
  const { id } = useLocalSearchParams();
  const queryKey = `${XEDI_GROUP_INFO.FEED}_${id}`;
  const { data } = useDataInfo<INewsFeedItem>(queryKey);
  const listRef = React.useRef<InfinityListMethods>(null);
  const dispatch = useDispatch();
  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView style={AppStyles.container}>
        <Box className="items-center justify-center" style={AppStyles.header}>
          <Heading>Bình luận</Heading>
          <Box className="absolute right-[16px]">
            <Button
              variant="link"
              action="default"
              onPress={() => router.back()}
            >
              <CloseIcon size={IconSize.md} color="#000" />
            </Button>
          </Box>
        </Box>
        <Box className="flex-1">
          <InfinityList
            ref={listRef}
            renderItem={function (data: {
              item: IComment;
              index: number;
              data?: any[];
            }): React.ReactNode {
              return (
                <HStack space="md" className="mb-[16px] px-[16px]">
                  <Avatar size="lg">
                    <AvatarFallbackText>
                      {data.item.users?.name || "XeDi"}
                    </AvatarFallbackText>
                  </Avatar>
                  <VStack>
                    <HStack space="md" className="items-center">
                      <Heading>{data.item.users?.name}</Heading>
                      <Text className="text-gray-500 text-xs">
                        {moment(data.item?.created_at).fromNow()}
                      </Text>
                    </HStack>
                    <Text className="text-lg">{data.item.content || ""}</Text>
                  </VStack>
                </HStack>
              );
            }}
            queryFn={async function (lastPage: any): Promise<IComment[]> {
              const { data } =
                await xediSupabase.tables.comments.selectByUserIdBeforeDate({
                  date: lastPage,
                  select: `*, ${Tables.USERS} (*)`,
                  filter: [
                    {
                      data: id as string,
                      filed: "feed_id",
                      filter: "eq",
                    },
                  ],
                });
              return data || [];
            }}
            getLastPageNumber={function (lastData: IComment[]) {
              return lastData?.[lastData.length - 1]?.created_at;
            }}
            ListEmptyComponent={
              <Box className="justify-center items-center flex-1">
                <Box className="w-[200px] h-[200px]">
                  <LottieView
                    source={Lottie.MESSAGE}
                    colorFilters={[]}
                    style={{ width: "100%", height: "100%" }}
                    autoPlay
                    loop
                  />
                  <Text className="w-full text-center text-xl text-black">Bạn hãy trở thành người bình luận đầu tiên!</Text>
                </Box>
              </Box>
            }
          />
        </Box>
        <Divider />
        <CommentInput
          onSendComment={(comment) => {
            listRef.current?.push?.(comment, 0);
            if (data) {
              dispatch(
                setFetchingData({
                  key: queryKey,
                  data: {
                    ...data,
                    comments: [
                      { count: (data?.comments?.[0]?.count || 0) + 1 },
                    ],
                  },
                })
              );
            }
          }}
        />
      </SafeAreaView>
    </Box>
  );
}
