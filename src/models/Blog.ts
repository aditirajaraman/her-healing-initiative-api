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

export interface IBlog extends mongoose.Document {
  id: number;
  title: string;
  author: string;
  authorIcon: string;
  blogImage:string;
  content:string;
  tag:string;
  likes: number;
  comments: number;
  publicationDate:Date;
  createdAt:Date;
  updatedAt:Date;
}

export const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  authorIcon: { type: String, required: true },
  blogImage: { type: String, required: true },
  content: { type: String, required: true },
  tag: { type: String, required: true },
  likes: { type: Number, required: true },
  comments: { type: Number, required: true },
  publicationDate: { type: Date, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: false }
});

const Blog = mongoose.model<IBlog>("blog", BlogSchema);
export default Blog;