import React from "react";
import { Button, ButtonText } from "../ui/button";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { xediSupabase } from "supabase-client";
import { generateUUID } from "@/src/utils/uuid";
import { base64ToUint8Array } from "@/src/utils";

const CreatePostButton: React.FC<{
  onError: (message: string) => any;
  onCreatePostSuccess: () => any;
}> = ({ onCreatePostSuccess, onError }) => {
  const user: IUser | null = useSelector((state: RootState) => state.auth.user);

  const { content, tripRequest, fixedRoutes, images } = useSelector(
    (state: RootState) => state.postForm
  );

  const uploadImage = async (newFeed: INewsFeedItem) => {
    try {
      if (!!images.length) {
        for (const path of images) {
          const name = `${generateUUID()}.jpg`;
          await xediSupabase
            .getBucket()
            .upload(name, base64ToUint8Array(path), {
              contentType: "image/jpeg",
            });
          await xediSupabase.tables.feedMedia.addWithUserId([
            {
              path: name,
              feed_id: newFeed.id,
              content_type: "image",
            } as IFeedMediaSource,
          ]);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handlerCustomerPostWithTripRequest = async () => {
    if (!tripRequest.departureTime) {
      onError(
        "Bạn cần thêm thời điểm khởi hành để tài xế thuận tiện trong việc đưa đón nhé!"
      );
      return;
    }
    if (!tripRequest.startLocation?.display_name) {
      onError(
        "Bạn cần thêm điểm khởi hành để tài xế thuận tiện trong việc đưa đón nhé!"
      );
      return;
    }
    if (!tripRequest.endLocation?.display_name) {
      onError(
        "Bạn cần thêm điểm đến hành để tài xế thuận tiện trong việc đưa đón nhé!"
      );
      return;
    }
    const { data: tripRequestData } = await xediSupabase.tables.tripRequest.add(
      [
        {
          startLocation: tripRequest.startLocation,
          endLocation: tripRequest.endLocation,
          user_id: user.id,
          departureTime: tripRequest.departureTime,
          type: "Taxi",
        },
      ]
    );
    const { data } = await xediSupabase.tables.feed.addWithUserId([
      { content },
    ]);
    if (data?.[0]) {
      tripRequestData.forEach((tripRequest) =>
        xediSupabase.tables.tripRequest.updateById(tripRequest.id, {
          feed_id: data[0].id,
        })
      );
      await uploadImage(data[0]);
      onCreatePostSuccess();
    }
  };

  const handlerDriverPostWithFixedRoute = async () => {
    if (!fixedRoutes.departureTime) {
      onError(
        "Bạn cần thêm thời điểm khởi hành để tài xế thuận tiện trong việc đưa đón nhé!"
      );
      return;
    }
    if (!fixedRoutes.startLocation?.display_name) {
      onError(
        "Bạn cần thêm điểm khởi hành để tài xế thuận tiện trong việc đưa đón nhé!"
      );
      return;
    }
    if (!fixedRoutes.endLocation?.display_name) {
      onError(
        "Bạn cần thêm điểm đến hành để tài xế thuận tiện trong việc đưa đón nhé!"
      );
      return;
    }
    if (!fixedRoutes.price) {
      onError("Bạn cần thêm điểm giá cho chuyến đi");
      return;
    }
    const { data: fixedRouteData } = await xediSupabase.tables.fixedRoutes.add([
      {
        startLocation: fixedRoutes.startLocation,
        endLocation: fixedRoutes.endLocation,
        user_id: user.id,
        departureTime: fixedRoutes.departureTime,
        totalSeats: parseInt(`${fixedRoutes?.totalSeats || 0}`),
        availableSeats: parseInt(`${fixedRoutes?.totalSeats || 0}`),
        price: parseFloat(`${fixedRoutes.price || 0}`),
      },
    ]);
    const { data } = await xediSupabase.tables.feed.addWithUserId([
      { content },
    ]);
    if (data?.[0]) {
      fixedRouteData.forEach((fixedRoute) =>
        xediSupabase.tables.fixedRoutes.updateById(fixedRoute.id, {
          feed_id: data[0].id,
        })
      );
      await uploadImage(data[0]);
      onCreatePostSuccess();
    }
  };

  const handlerCustomerPost = async () => {
    if (
      !!tripRequest.departureTime ||
      !!tripRequest.startLocation?.display_name ||
      !!tripRequest.endLocation?.display_name
    ) {
      await handlerCustomerPostWithTripRequest();
    } else {
      const { data } = await xediSupabase.tables.feed.addWithUserId([
        { content },
      ]);
      if (data?.[0]) {
        await uploadImage(data[0]);
        onCreatePostSuccess();
      }
    }
  };

  const handleDriverPost = async () => {
    if (
      !!fixedRoutes.departureTime ||
      !!fixedRoutes.startLocation?.display_name ||
      !fixedRoutes.endLocation?.display_name
    ) {
      await handlerDriverPostWithFixedRoute();
      return;
    }
    const { data } = await xediSupabase.tables.feed.addWithUserId([
      { content },
    ]);
    if (data?.[0]) {
      await uploadImage(data[0]);
      onCreatePostSuccess();
    }
  };

  return (
    <Button
      className={`rounded-full ${
        !content && !images.length ? "bg-primary-400/[.5]" : "bg-primary-400"
      }`}
      size="lg"
      onPress={
        user?.role === "customer" ? handlerCustomerPost : handleDriverPost
      }
      disabled={!content && !images.length}
    >
      <ButtonText>Tạo</ButtonText>
    </Button>
  );
};

export default CreatePostButton;
