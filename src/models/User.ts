import * as mongoose from "mongoose";

const connectDB = async () => {
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/her-healing-initiative');
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
};

connectDB();

export interface IUser extends mongoose.Document {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  country: string;
  birthdate:Date;
}

export const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  birthdate: { type: Date, required: false }
});

const User = mongoose.model<IUser>("user", UserSchema);
export default User;