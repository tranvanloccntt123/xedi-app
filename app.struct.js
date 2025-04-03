module.exports = {
  // App directory
  ROOT_LAYOUT: "app/_layout.tsx",

  // Auth group
  AUTH_LAYOUT: "app/(auth)/_layout.tsx",
  SIGN_IN_SCREEN: "app/(auth)/sign-in.tsx",
  SIGN_UP_SCREEN: "app/(auth)/sign-up.tsx",

  // App group (protected routes)
  APP_LAYOUT: "app/(app)/_layout.tsx",
  ROOT_GROUP_LAYOUT: "app/(app)/(root)/_layout.tsx",
  HOME_SCREEN: "app/(app)/(root)/(tabs)/index.tsx",
  RIDE_SCREEN: "app/(app)/(root)/(tabs)/ride.tsx",
  TRIP_REQUESTS_SCREEN: "app/(app)/(root)/(tabs)/trip-requests.tsx",
  PROFILE_SCREEN: "app/(app)/(root)/(tabs)/profile.tsx",
  FOOD_SCREEN: "app/(app)/food.tsx",
  CREATE_FIXED_ROUTE_SCREEN: "app/(app)/create-fixed-route.tsx",
  CREATE_TRIP_REQUEST_SCREEN: "app/(app)/create-trip-request.tsx",
  FIXED_ROUTE_DETAIL_SCREEN: "app/(app)/fixed/[id]/detail.tsx",
  EDIT_FIXED_ROUTE_SCREEN: "app/(app)/fixed/[id]/edit.tsx",
  CHAT_SCREEN: "app/(app)/chat/[id].tsx",
  EDIT_PROFILE_SCREEN: "app/(app)/(root)/edit-profile.tsx",

  // Components
  ADD_FIXED_ROUTE_MODAL: "src/components/AddFixedRouteModal.tsx",
  FIXED_ROUTES_LIST: "src/components/FixedRoutesList.tsx",
  FIXED_ROUTES_ITEM: "src/components/FixedRouteItem.tsx",
  TRIP_REQUEST_LIST: "src/components/TripRequestList.tsx",
  DATE_TIME_PICKER: "src/components/DateTime.tsx",

  // Src directory
  STORE: "src/store/store.ts",
  AUTH_SLICE: "src/store/authSlice.ts",
  AUTH_CONTEXT: "src/contexts/auth.tsx",
  TYPES: "src/types/index.d.ts",
}

