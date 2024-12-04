import { createRealmContext } from "@realm/react";
import {
  ChatMessage,
  ChatRoom,
  FixedRoute,
  Rating,
  TripRequest,
  TripRequestForFixedRoute,
  User,
  Vehicle,
} from "../models/RealmModels";

export const RealmContext = createRealmContext({
  schema: [
    ChatMessage,
    ChatRoom,
    FixedRoute,
    Rating,
    TripRequest,
    TripRequestForFixedRoute,
    User,
    Vehicle,
  ],
});
