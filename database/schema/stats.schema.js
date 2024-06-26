import mongoose from "mongoose";

const { Schema } = mongoose;

const schema = new Schema(
  {
   totalCoinMinned:{
    type:Number,
    default:0
   },
   dailCoinReward:{
    type:Number,
   },
   coinSymbol:{
    type:String,
   }
  },
  { timestamps: true }
);

const statsSchema = mongoose.model("stats", schema);

export default statsSchema;
