import mongoose from "mongoose";

const { Schema } = mongoose;

const schema = new Schema(
  {
    id: {
      type: Number,
      indexed: true,
      default: 0,
    },
    name: {
      type: String,
    },
    imgUrl: {
      type: String,
    },
    levelAmount: [
      {
        level: {
          type: Number,
        },
        buyingPrice: {
          type: Number,
        },
        buffIncrement: {
          type: Number,
        },
      },
    ],
    maxLevel: {
      type: Number,
    },

    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const boosterSchema = mongoose.model("booster", schema);
schema.index({ id: 1 });
export default boosterSchema;
