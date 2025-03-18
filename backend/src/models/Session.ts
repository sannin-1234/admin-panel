import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISession extends Document {
  _id: Types.ObjectId;
  name: string;
  status: string;
  type: string;
  sessionDateTime: string;
  duration: string;
  location: string;
  isNewClient: boolean;
  isPaid: boolean;
  createdAt: string;
  rescheduledAt: string;
  rescheduledBy: string;
  rescheduledReason: string;
  rescheduledStatus: string;
  isPackageCreated: Boolean;
  organizationId: string;
  packageId: string;
  createdBy: string;
}

const SessionSchema = new Schema<ISession>({
  name: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["pending", "completed", "rescheduled"],
  },
  type: {
    type: String,
    required: true,
    enum: [
      "call",
      "individual-session",
      "couple",
      "organization",
      "event",
      "package",
      "online-meeting",
      "offline",
      "online",
    ],
  },
  sessionDateTime: { type: String, required: true },
  duration: { type: String, required: true },
  location: { type: String, required: true },
  isNewClient: { type: Boolean, required: true },
  isPaid: { type: Boolean, required: true },
  createdAt: { type: String, required: true },
  rescheduledAt: { type: String, required: true },
  rescheduledBy: { type: String, required: true },
  rescheduledReason: { type: String, required: true },
  rescheduledStatus: {
    type: String,
    required: true,
    enum: ["pending", "approved", "rejected"],
  },
  isPackageCreated: { type: Boolean, required: true },
  organizationId: { type: String, required: true },
  packageId: { type: String, required: true },
  createdBy: { type: String, required: true },
});

const Session = mongoose.model<ISession>("Session", SessionSchema);
export default Session;
