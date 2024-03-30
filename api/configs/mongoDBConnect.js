import mongoose from "mongoose";
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_PROD_URI);
  } catch (err) {
    console.error(err);
  }
};

export const connectTestDB = async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE_LOCAL_URI}-test`);
  } catch (err) {
    console.error(err);
  }
};
