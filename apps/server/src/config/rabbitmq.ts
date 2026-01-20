export const RABBITMQ_CONFIG = {
  url: ENV.RABBITMQ_URL || "amqp://localhost",
  queues: {
    email: "email_queue",
    notification: "notification_queue",
  },
};
