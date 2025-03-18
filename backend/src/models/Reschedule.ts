import mongoose, { Document, Schema } from "mongoose";

export interface IReschedule extends Document {
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  status: string;
  reason: string;
  clientId: string;
}

const RescheduleSchema = new Schema<IReschedule>({
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  type: { type: String, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["pending", "approved", "rejected"],
  },
  clientId: { type: String, required: true },
});

export default mongoose.model("Reschedule", RescheduleSchema);
