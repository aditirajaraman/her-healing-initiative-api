import * as mongoose from "mongoose";
import { boolean } from "zod";

const connectDB = async () => {
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/her-healing-initiative');
      //console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
};

connectDB();

export interface FAQ {
  question: string;
  answer: string;
}

export interface itenary {
  subject: string;
  location: string;
  description: string;
  startTime: string;
  endTime: string;
  isallday: boolean;
  istimezone: boolean;
  startTimeZone: string;
  endTimeZone: string;
}

export interface IEvent extends mongoose.Document {
  eventId: string;
  eventTitle: string;
  eventSubTitle: string;
  eventSummary: string;
  eventImage: string;
  eventTags: string[];
  eventOrganizerType: string;
  eventOrganizers: string[];
  eventLocationType: string;
  eventLocation: string;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  createdAt:Date;
  updatedAt:Date;
  faqs: FAQ[];
  itenaries: itenary[];
}

export const EventSchema = new mongoose.Schema({
  eventId: { type: String, required: true },
  eventTitle: { type: String, required: true },
  eventSubTitle: { type: String, required: true },
  eventSummary: { type: String, required: true },
  eventImage: { type: String, required: false },
  eventTags: { type: [String], required: true },
  eventOrganizerType: { type: String, required: true },
  eventOrganizers: { type: [String], required: false },
  eventLocationType: { type: String, required: true },
  eventLocation: { type: String, required: false },
  eventDate: { type: String, required: true },
  eventStartTime: { type: String, required: true },
  eventEndTime: { type: String, required: true },
  faqs: {
    type: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true }
      }
    ],
    required: false
  },
  itenaries: {
    type: [
      {
        title: { type: String, required: true },
        location: { type: String, required: true },
        description: { type: String, required: true },
        allday: { type: Boolean, required: false },
        timezone: { type: Boolean, required: false },
        startTime: { type: String, required: false },
        endTime: { type: String, required: false },
        startTimeZone: { type: String, required: false },
        endTimeZone: { type: String, required: false }
      }
    ],
    required: false
  },
  createdAt: { type: Date, required: false },
  updatedAt: { type: Date, required: false }
}, { collection: 'events' }); // <-- Explicit collection name

const Event = mongoose.model<IEvent>("event", EventSchema);
export default Event;