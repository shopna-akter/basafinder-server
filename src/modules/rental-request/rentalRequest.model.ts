import mongoose, { Schema, Document } from "mongoose";

export interface IRentalRequest extends Document {
  tenant: mongoose.Schema.Types.ObjectId;
  rental: mongoose.Schema.Types.ObjectId;
  status: "pending" | "approved" | "rejected";
}

const RentalRequestSchema = new Schema<IRentalRequest>(
  {
    tenant: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rental: { type: Schema.Types.ObjectId, ref: "Rental", required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model<IRentalRequest>("RentalRequest", RentalRequestSchema);
