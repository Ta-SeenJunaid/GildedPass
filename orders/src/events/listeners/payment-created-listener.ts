import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from '@tj-gildedpass/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: any) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }
    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}
