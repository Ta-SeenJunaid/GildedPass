import { OrderCreatedEvent, Publisher, Subjects } from '@tj-gildedpass/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
