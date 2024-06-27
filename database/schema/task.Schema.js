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
    discription:{
        type: String,
        default:""
    },
    rewardAmount: {
      type: String,
    },
    requirment:{
      type:Number
    },
    Url:{
        type: String,
    },
    imgUrl:{
        type: String,
    },
    group:{
        type: String,
    },
    enabled:{
        type:Boolean,
        default:true
    }
  },
  { timestamps: true }
);

const taskSchema = mongoose.model("tasks", schema);
schema.index({ id: 1 });
export default taskSchema;
