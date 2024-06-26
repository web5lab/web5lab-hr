import mongoose from "mongoose";

const { Schema } = mongoose;

const schema = new Schema(
  {
    id: {
      type: Number,
      default: 0,
    },
    tittle: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    requiredAmount: {
      type: String,
    },
    RefralAmount: {
      type: String,
    },
    premiumReferalAmount: {
      type: String,
    },
  },
  { timestamps: true }
);

const rankSchema = mongoose.model("ranks", schema);
schema.index({ id: 1 });
export default rankSchema;
