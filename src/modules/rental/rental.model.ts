import mongoose, { Schema, Document } from "mongoose";

export interface IRental extends Document {
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  landlord: mongoose.Schema.Types.ObjectId;
}

const RentalSchema = new Schema<IRental>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    landlord: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IRental>("Rental", RentalSchema);
