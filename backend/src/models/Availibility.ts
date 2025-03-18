import mongoose, { Document, Schema } from "mongoose";

export interface IAvailibility extends Document {
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  status: string;
  rescheduledStatus: string;
  sessionId: string;
}

const AvailibilitySchema = new Schema<IAvailibility>({
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  type: { type: String, required: true },
  rescheduledStatus: {
    type: String,
    default: "none",
    enum: ["none", "pending", "approved", "rejected"],
  },
  sessionId: { type: String, required: true },
});

export default mongoose.model("Availibility", AvailibilitySchema);
