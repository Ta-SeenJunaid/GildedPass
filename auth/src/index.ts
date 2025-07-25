import mongoose from 'mongoose';
import { app } from './app';

// A code comment to trigger CI/CD pipeline!!!

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!!!!!!');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined!!!!');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Mongodb connected successfully!!!!!!!!!');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000 !!!!!!!!!!!');
  });
};

start();
