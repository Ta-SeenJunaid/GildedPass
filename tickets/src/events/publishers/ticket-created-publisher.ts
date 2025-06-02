import { Publisher, Subjects, TicketCreatedEvent } from '@tj-gildedpass/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
