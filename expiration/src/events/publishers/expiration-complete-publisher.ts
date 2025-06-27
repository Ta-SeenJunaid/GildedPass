import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@tj-gildedpass/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
