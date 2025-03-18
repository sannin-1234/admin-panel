import mongoose, { Document, Schema } from "mongoose";

export interface IOrganization extends Document {
  id: string;
  name: string;
  location: string;
  code: string;
  country: string;
  description: string;
  status: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

const OrganizationSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    code: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String },
    status: { type: String, required: true },
    createdAt: { type: String, required: true },
    createdBy: { type: String, required: true },
    updatedAt: { type: String, required: false },
    updatedBy: { type: String, required: false },
  },
 
);

export default mongoose.model("Organization", OrganizationSchema);
