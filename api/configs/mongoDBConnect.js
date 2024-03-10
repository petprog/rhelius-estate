import mongoose from "mongoose";
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    console.error(err);
  }
};

export const connectTestDB = async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE_TEST_URI}-test`);
  } catch (err) {
    console.error(err);
  }
};
