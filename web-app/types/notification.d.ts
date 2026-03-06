interface Notification {
  id: string;
  guid: string;
  firebotId: string;
  title: string;
  message: string;
  type: string;
  metadata?: Record<string, unknown>;
  insertedAt: Date;
}
