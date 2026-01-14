export const RABBITMQ_CONFIG = {
    url: process.env.RABBITMQ_URL || "amqp://localhost",
    queues: {
        email: "email_queue"
    }
};
