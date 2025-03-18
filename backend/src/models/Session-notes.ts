import mongoose, { Document, Schema } from "mongoose";

export interface INote extends Document {
  sessionId: string;
  authorId: string;
  authorRole: "therapist" | "client";
  commentText: string;
  createdAt: Date;
  updatedAt?: Date;
  isEdited: boolean;
  isDeleted: boolean;
}

const NoteSchema = new Schema<INote>(
  {
    sessionId: { type: String, required: true },
    authorId: { type: String, required: true },
    authorRole: { type: String, required: true },
    commentText: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    isEdited: { type: Boolean, required: true },
    isDeleted: { type: Boolean, required: true },
  },
  
);

export default mongoose.model("Notes", NoteSchema);
