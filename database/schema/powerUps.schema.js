import mongoose from "mongoose";

const { Schema } = mongoose;

const schema = new Schema(
  {
    id: {
      type: Number,
      default: 0,
    },
    group: {
      type: String,
    },
    name: {
      type: String,
    },
    imgUrl: {
      type: String,
    },
    maxLevel: {
      type: Number,
    },
    levelAmount: [
      {
        level: {
          type: Number,
        },
        buyingPrice: {
          type: Number,
        },
        miningRate: {
          type: Number,
        },
      },
    ],

    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const powerUpsSchema = mongoose.model("powerUps", schema);
schema.index({ id: 1 });
export default powerUpsSchema;
