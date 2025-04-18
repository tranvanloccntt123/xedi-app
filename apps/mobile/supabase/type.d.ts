type NOTIFICATION_TYPE = "FIXED_ROUTE_ORDER_UPDATE" | "FIXED_ROUTE_RUNNING" | "FIXED_ROUTE_FINISHED";

interface MultiNotification {
  user_ids: string[];
  body: string;
  title?: string;
  fromId?: string;
}

interface WebhookMultiNotificationPayload {
  type: NOTIFICATION_TYPE;
  record: MultiNotification;
  schema: "public";
}