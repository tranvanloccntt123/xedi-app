import React from "react";
import { Box } from "@/src/components/ui/box";
import AppStyles from "@/src/theme/AppStyles";
import { Heading } from "@/src/components/ui/heading";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ButtonText } from "@/src/components/ui/button";
import CloseIcon from "@/src/components/icons/CloseIcon";
import { IconSize } from "@/src/theme/Size";
import { Divider } from "@/src/components/ui/divider";
import { router, useLocalSearchParams } from "expo-router";
import InfinityList, {
  InfinityListMethods,
} from "@/src/components/InfinityList";
import { xediSupabase } from "@/src/lib/supabase";
import { PartTypes, Tables } from "@/src/constants";
import { HStack } from "@/src/components/ui/hstack";
import { Avatar, AvatarFallbackText } from "@/src/components/ui/avatar";
import { VStack } from "@/src/components/ui/vstack";
import { Text } from "@/src/components/ui/text";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
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
import { Pressable, useWindowDimensions } from "react-native";
import { MentionInput } from "@/src/components/ControlledMentions";

//@[name](id)

interface CommentInputProps {
  onSendComment: (comment: IComment) => any;
}

interface CommentInputMethods {
  reply: (comment: IComment) => any;
}

const CommentInput = React.forwardRef<CommentInputMethods, CommentInputProps>(
  ({ onSendComment }, ref) => {
    const { id } = useLocalSearchParams();
    const sendBtnAnim = useSharedValue(0);
    const user = useSelector((state: RootState) => state.auth.user);
    const [comment, setComment] = React.useState("");
    const mentionInputRef = React.useRef(null);
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

    React.useImperativeHandle(ref, () => {
      return {
        reply(replyComment) {
          if (!replyComment.users) {
            return;
          }
          setComment(
            `${comment} @[${replyComment.users.name}](${replyComment.users.id}) `
          );
          mentionInputRef.current?.focus();
        },
      };
    });

    return (
      <HStack space="md" className="p-[16px]">
        <Avatar size="md">
          <AvatarFallbackText>{user?.name || "XeDi"}</AvatarFallbackText>
        </Avatar>
        <MentionInput
          inputRef={mentionInputRef}
          placeholder="Gửi bình luận"
          value={comment}
          onChange={setComment}
          multiline={false}
          style={{
            flex: 1,
          }}
          containerStyle={{
            flex: 1,
          }}
          partTypes={PartTypes as never}
        />
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
  }
);

const CommentItem: React.FC<{
  comment: IComment;
  onReply: (comment: IComment) => any;
}> = ({ comment, onReply }) => {
  return (
    <HStack space="md" className="mb-[16px] px-[16px]">
      <Avatar size="md">
        <AvatarFallbackText>{comment.users?.name || "XeDi"}</AvatarFallbackText>
      </Avatar>
      <VStack>
        <HStack space="md" className="items-center">
          <Heading>{comment.users?.name}</Heading>
          <Text className="text-gray-500 text-xs">
            {moment(comment?.created_at).fromNow()}
          </Text>
        </HStack>
        <MentionInput
          value={comment.content}
          onChange={function (value: string) {}}
          editable={false}
          partTypes={PartTypes as never}
        />
        <Pressable onPress={() => onReply(comment)}>
          <Text className="text-gray-500 text-sm">Trả lời</Text>
        </Pressable>
      </VStack>
    </HStack>
  );
};

export default function Comment() {
  const { id } = useLocalSearchParams();
  const queryKey = `${XEDI_GROUP_INFO.FEED}_${id}`;
  const { data } = useDataInfo<INewsFeedItem>(queryKey);
  const listRef = React.useRef<InfinityListMethods>(null);
  const commentRef = React.useRef<CommentInputMethods>(null);
  const { height, width } = useWindowDimensions();
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
                <CommentItem
                  comment={data.item}
                  onReply={(comment) => {
                    commentRef.current?.reply(comment);
                  }}
                />
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
              <Box className="justify-center" style={{ height: height * 0.6 }}>
                <Box className="w-[200px] h-[200px] self-center mb-[16px]">
                  <LottieView
                    source={Lottie.MESSAGE}
                    colorFilters={[]}
                    style={{ width: "100%", height: "100%" }}
                    autoPlay
                    loop
                  />
                </Box>
                <Text
                  className="text-center text-xl text-black px-[16px]"
                  style={{ width }}
                >
                  Bạn hãy trở thành người bình luận đầu tiên!
                </Text>
              </Box>
            }
          />
        </Box>
        <Divider />
        <CommentInput
          ref={commentRef}
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
