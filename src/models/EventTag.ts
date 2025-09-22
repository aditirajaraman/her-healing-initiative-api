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

export interface IEventTag extends mongoose.Document {
  name: string;
  value: string;
  groupName: string;
  groupCode: string;
}

export const EventTagSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  groupName: { type: String, required: true },
  groupCode: { type: String, required: true }
}, { collection: 'eventTags' }); // <-- Explicit collection name

const EventTag = mongoose.model<IEventTag>("eventTag", EventTagSchema);
export default EventTag;