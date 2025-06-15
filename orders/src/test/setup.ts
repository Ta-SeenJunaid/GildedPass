import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

jest.setTimeout(900000);

declare global {
  var setTestSessionCookie: () => string[];
}

jest.mock('../nats-wrapper');

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'test';

  mongo = await MongoMemoryServer.create();

  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.setTestSessionCookie = () => {
  // Build a JWT payload, {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test.ticket@test.com',
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object, {jwt: jwt_string}
  const session = { jwt: token };

  // Turn the session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
