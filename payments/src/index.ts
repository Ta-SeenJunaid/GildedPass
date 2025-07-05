import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!!!!');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined!!!!');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined!!!!');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined!!!!');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined!!!!');
  }

  if (!process.env.STRIPE_KEY) {
    throw new Error('STRIPE_KEY must be defined!!!!');
  }

  console.log('JWT!!!!!!!!!!!!!!!!!: ', process.env.JWT_KEY);
  console.log('Stripe !!!!!!!!!!!!!!!!!: ', process.env.STRIPE_KEY);

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
    new OrderCancelledListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000 !!!!!!!!!!!');
  });
};

start();
