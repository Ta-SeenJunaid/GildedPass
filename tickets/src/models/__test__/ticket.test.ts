import { Ticket } from '../ticket';

it('check version concurrency control', async () => {
  // create an instance of ticket
  const ticket = Ticket.build({
    title: 'Test title',
    price: 25,
    userId: '123',
  });

  // save the ticket to the database
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // two seperate changes to the tickets we fetched
  firstInstance?.set({ price: 15 });
  secondInstance?.set({ price: 35 });

  // save the first fetched ticket
  await firstInstance?.save();
  // save the second fetched ticket and expect an error
  try {
    await secondInstance?.save();
  } catch (err) {
    return;
  }

  throw new Error('Should not reach at this point');
});

it('increments the version number', async () => {
  const ticket = Ticket.build({
    title: 'Test title',
    price: 25,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
