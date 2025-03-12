import React from "react";
import { Button, ButtonText } from "../ui/button";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { xediSupabase } from "../../lib/supabase";
import { IUser } from "../../types";

const CreatePostButton: React.FC<{
  onError: (message: string) => any;
  onCreatePostSuccess: () => any;
}> = ({ onCreatePostSuccess, onError }) => {
  const user: IUser | null = useSelector((state: RootState) => state.auth.user);

  const { content, tripRequest } = useSelector(
    (state: RootState) => state.postForm
  );

  const handlerCustomerPostWithTripRequest = async () => {
    if (!tripRequest.departureTime) {
      onError(
        "Bạn cần thêm thời điểm khởi hành để tài xế thuận tiện trong việc đưa đón nhé!"
      );
      return;
    }
    if (!tripRequest.startLocation) {
      onError(
        "Bạn cần thêm điểm khởi hành để tài xế thuận tiện trong việc đưa đón nhé!"
      );
      return;
    }
    if (!tripRequest.endLocation) {
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
      onCreatePostSuccess();
    }
  };

  const handlerCustomerPost = async () => {
    if (
      !!tripRequest.departureTime ||
      !!tripRequest.startLocation ||
      !!tripRequest.endLocation
    ) {
      await handlerCustomerPostWithTripRequest();
    } else {
      const { data } = await xediSupabase.tables.feed.addWithUserId([
        { content },
      ]);
      if (data?.[0]) {
        onCreatePostSuccess();
      }
    }
  };

  const handleDriverPost = async () => {
    const { data } = await xediSupabase.tables.feed.addWithUserId([
      { content },
    ]);
    onCreatePostSuccess();
    // if (data?.[0]) {
    //   if (fixedRoutes) {
    //     fixedRoutes.forEach(async (fixedRoute) => {
    //       xediSupabase.tables.fixedRoutes.updateById(fixedRoute.id, {
    //         feed_id: data[0].id,
    //       });
    //     });
    //   }
    //   onCreatePostSuccess();
    //   return;
    // }
  };

  return (
    <Button
      className={`rounded-full ${
        content ? "bg-primary-400" : "bg-primary-400/[.5]"
      }`}
      size="lg"
      onPress={
        user?.role === "customer" ? handlerCustomerPost : handleDriverPost
      }
      disabled={!content}
    >
      <ButtonText>Tạo</ButtonText>
    </Button>
  );
};

export default CreatePostButton;
