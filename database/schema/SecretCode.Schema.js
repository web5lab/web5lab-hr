import mongoose from "mongoose";

const { Schema } = mongoose;

const schema = new Schema(
  {
    id:{
        type:Number,
        default:1
    },
    currentCode: {
      type: Number,
      default: 0,
    },
    rewardAmount: {
      type: Number,
    },
  },
  { timestamps: true }
);

const SecretCodeSchema = mongoose.model("secretCode", schema);
schema.index({ currentCode: 1 });

export default SecretCodeSchema;
