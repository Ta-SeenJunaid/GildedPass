import request from 'supertest';
import { app } from '../../app';

it('returns a 201 if signup is successfull!!', async () => {
  return await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password1234',
    })
    .expect(201);
});

it('returns a 400 if email is invalid', async () => {
  return await request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest.com',
      password: 'password1234',
    })
    .expect(400);
});

it('returns a 400 if password is invalid', async () => {
  return await request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest.com',
      password: 'p',
    })
    .expect(400);
});

it('returns a 400 if email or password is missing', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'password123',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest.com',
    })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password1234',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password1234',
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password1234',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
