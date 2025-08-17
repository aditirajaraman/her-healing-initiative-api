import * as mongoose from "mongoose";

const connectDB = async () => {
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/her-healing-initiative');
      //console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
};

connectDB();

export interface ITag extends mongoose.Document {
  name: string;
  value: string;
}

export const TagSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true }
});

const Tag = mongoose.model<ITag>("tag", TagSchema);
export default Tag;