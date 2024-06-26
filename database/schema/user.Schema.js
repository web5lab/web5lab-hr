import mongoose from "mongoose";

const { Schema } = mongoose;

const schema = new Schema(
  {
    id: {
      type: Number,
      unique: true,
      default: 0,
    },
    userName: {
      type: String,
    },
    instanaceId: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
    },
    Balance: {
      type: Number,
      default: 0,
    },
    referalId: {
      type: Number,
      default:0
    },
    referedBy: {
      type: Number,
      default:0
    },
    lastClaimTime: {
      type: Date,
    },
    lastLoginTime: {
      type: Date,
    },
    lastMiningTime: {
      type: Number,
      default:0
    },
    completedTask: [],
    boosterCrads: [
      {
        id: {
          type: Number,
        },
        level: {
          type: Number,
        },
      },
    ],
    miningCards: [
      {
        id: {
          type: Number,
        },
        level: {
          type: Number,
        },
      },
    ],
    dailyTask: [],
    powerUps: {
      refill: {
        used: {
          type: Boolean,
          default: false,
        },
        usedTiming: {
          type: Date,
        },
      },
      boost: {
        remaining: {
          type: Number,
          default: 3,
        },
      },
    },
    weeklyEarning: {
      type: Number,
      default: 0,
    },
    DailyEarning: {
      type: Number,
      default: 0,
    },
    totalEarning: {
      type: Number,
      default: 0,
    },
    MiningRatePerHour: {
      type: Number,
      default: 0,
    },
    earnPerclicks: {
      type: Number,
      default: 1,
    },
    currentRank: {
      type: Number,
      default: 1,
    },
    rechargeRate: {
      type: Number,
      default: 1,
    },
    currentNetwork: {
      type: Number,
      default: 1,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userSchema = mongoose.model("user", schema);
schema.index({ id: 1 });
schema.index({ referalId: 1 });
schema.index({ referedBy: 1 });
schema.index({ weeklyEarning: 1 });
schema.index({ DailyEarning: 1 });
schema.index({ totalEarning: 1 });
schema.index({ currentRank: 1 });
schema.index({ currentNetwork: 1 });

export default userSchema;
