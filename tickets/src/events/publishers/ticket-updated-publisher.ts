import { Publisher, Subjects, TicketUpdatedEvent } from '@tj-gildedpass/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
