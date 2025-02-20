type NOTIFICATION_TYPE = "FIXED_ROUTE_ORDER_UPDATE" | "FIXED_ROUTE_RUNNING";

interface WebhookPayload {
  type: NOTIFICATION_TYPE;
  record: Notification;
  schema: "public";
}

interface Notification {
  user_id: string;
  body: string;
  title?: string;
}

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