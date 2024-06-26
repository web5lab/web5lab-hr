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
    Symbol: {
      type: String,
    },
    logo: {
      type: String,
    },
  },
  { timestamps: true }
);

const networkSchema = mongoose.model("networks", schema);
schema.index({ id: 1 });
export default networkSchema;
