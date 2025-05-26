import request from 'supertest';
import { app } from '../../app';

it('a route handler listening to /api/tickets for post request', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('only authorized access while user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status code which is not 401 for authorized/signed in user', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.setTestSessionCookie())
    .send({});
  console.log(response.status);
  console.log(global.setTestSessionCookie());
  expect(response.status).not.toEqual(401);
});

it('returns an error when an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.setTestSessionCookie())
    .send({
      title: '',
      price: 100,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.setTestSessionCookie())
    .send({
      price: 100,
    })
    .expect(400);
});

it('returns an error when an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.setTestSessionCookie())
    .send({
      title: 'This is a test title',
      price: -4,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.setTestSessionCookie())
    .send({
      title: 'This is a test title',
    })
    .expect(400);
});

it('creates a ticket with valid tickets with vaid inputs', async () => {});
