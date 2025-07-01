import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';
// Importing the expiration queue to register the job processor with Bull.
//
// Even though we don't directly use anything from this file here,
// the `expirationQueue.process(...)` inside it must be executed at startup
// so Bull knows how to handle delayed jobs when they're ready.
//
// Without this import, the job handler would never be registered,
// and queued jobs would sit idle in Redis.
import './queues/expiration-queue';


const start = async () => {
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined!!!!');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined!!!!');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined!!!!');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!!!!!!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
  } catch (err) {
    console.error(err);
  }

  try {
    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
  }
};

start();
