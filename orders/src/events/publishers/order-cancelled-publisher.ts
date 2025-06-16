import {
  OrderCancelledEvents,
  Publisher,
  Subjects,
} from '@tj-gildedpass/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvents> {
  readonly subject = Subjects.OrderCancelled;
}
