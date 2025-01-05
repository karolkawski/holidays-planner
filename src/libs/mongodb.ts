import mongoose from 'mongoose';

const connectMongoDB = () => {
  const envURI = process.env.MONGODB_URI || null;

  if (!envURI) {
    new Error(`Environment variable MONGODB_URI is not defined`);
  }
  try {
    mongoose
      .connect(envURI as string)
      .then(() => {
        mongoose.set('debug', true);
        console.log('database connected 🫡');
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};

export default connectMongoDB;
