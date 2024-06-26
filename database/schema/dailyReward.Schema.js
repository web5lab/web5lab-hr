import mongoose from "mongoose";

const { Schema } = mongoose;

const schema = new Schema(
  {
    day: {
      type: Number,
      default: 0,
    },
    rewardAmount: {
      type: Number,
    },
  },
  { timestamps: true }
);

const dailyRewardSchema = mongoose.model("dailyRewards", schema);
schema.index({ day: 1 });

export default dailyRewardSchema;
