import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@tj-gildedpass/common';
import { stripe } from '../../stripe';

jest.mock('../../stripe');

it('returns a 404 when purchaising an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.setTestSessionCookie())
    .send({
      token: 'TestToken',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 when purchaising an order that doesnot belong to the user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 68,
    status: OrderStatus.Created,
    version: 0,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.setTestSessionCookie())
    .send({
      token: 'TestToken',
      orderId: order.id,
    })
    .expect(401);
});

it('returns a 400 when purchaising a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    price: 68,
    status: OrderStatus.Cancelled,
    version: 0,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.setTestSessionCookie(userId))
    .send({
      token: 'TestToken',
      orderId: order.id,
    })
    .expect(400);
});

it('returns a 204 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    price: 68,
    status: OrderStatus.Created,
    version: 0,
  });

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.setTestSessionCookie(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  const chargeOptions = (stripe.paymentIntents.create as jest.Mock).mock
    .calls[0][0];
  expect(chargeOptions.payment_method).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(68 * 100);
  expect(chargeOptions.currency).toEqual('eur');
});
