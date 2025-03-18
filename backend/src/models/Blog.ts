import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document {
  title: string;
  desc: string;
  date: string;
  author: string;
  time: string;
  status: string;
}

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  date: { type: String, required: true },
  author: { type: String, required: true },
  time: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["pending", "approved", "rejected"],
  },
});

export default mongoose.model("Blog", BlogSchema);
