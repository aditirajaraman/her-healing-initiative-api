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

export interface IEvent extends mongoose.Document {
  eventTitle: string;
  eventSubTitle: string;
  eventSummary: string;
  eventImage: string;
  eventTag: string;
  eventOrganizer: string;
}

export const EventSchema = new mongoose.Schema({
  eventTitle: { type: String, required: true },
  eventSubTitle: { type: String, required: true },
  eventSummary: { type: String, required: true },
  eventImage: { type: String, required: true },
  eventTag: { type: String, required: true },
  eventOrganizer: { type: String, required: true }
}, { collection: 'events' }); // <-- Explicit collection name

const Event = mongoose.model<IEvent>("event", EventSchema);
export default Event;