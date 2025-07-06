import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from '@tj-gildedpass/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
