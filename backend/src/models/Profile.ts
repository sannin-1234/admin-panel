import mongoose, { Document, Schema } from "mongoose";

export interface IProfile extends Document {
  bio: string;
  userId: string;
  qualification: string;
  specialization: string;
  experience: string;
  age: string;
  gender: string;
}

const ProfileSchema = new Schema<IProfile>(
  {
    bio: { type: String },
    userId: { type: String, required: true },
    qualification: { type: String },
    specialization: { type: String },
    experience: { type: String },
  },
 
);

export default mongoose.model("Profile", ProfileSchema);
