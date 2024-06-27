import mongoose from "mongoose";
import taskSchema from "./database/schema/task.Schema.js";
import networkSchema from "./database/schema/network.schema.js";
import rankSchema from "./database/schema/ranks.schema.js";
import dailyRewardSchema from "./database/schema/dailyReward.Schema.js";
import boosterSchema from "./database/schema/booster.Schema.js";
import powerUpsSchema from "./database/schema/powerUps.schema.js";
import userSchema from "./database/schema/user.Schema.js";

const mongodbUri =
  "mongodb+srv://shiva:77395644@cluster0.qz60sng.mongodb.net/minerdoge-beta";

const databaseConnection = async function (callback) {
  await mongoose
    .connect(mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    })
    .then((res) => {
      console.log("database connected");
    })
    .catch((err) => {
      console.log(err);
    });
};

const networks = [
  {
    id: 1,
    tittle: "BITCOIN",
    Symbol: "BTC",
    logo: "networks/bitcoin.png",
  },
  {
    id: 2,
    tittle: "ETHEREUM",
    Symbol: "ETH",
    logo: "networks/ethereum.png",
  },
  {
    id: 3,
    tittle: "DOGECOIN",
    Symbol: "DOGE",
    logo: "networks/doge.jpg",
  },
  {
    id: 4,
    tittle: "SOLANA",
    Symbol: "SOL",
    logo: "networks/sol.png",
  },
  {
    id: 5,
    tittle: "BINANCE",
    Symbol: "BSC",
    logo: "networks/bsc.png",
  },
  {
    id: 6,
    tittle: "POLYGON",
    Symbol: "MATIC",
    logo: "networks/polygon.png",
  },
  {
    id: 7,
    tittle: "AVALANCHE",
    Symbol: "AVAX",
    logo: "networks/avax.png",
  },
  {
    id: 8,
    tittle: "TRON",
    Symbol: "TRX",
    logo: "networks/trx.png",
  },
  {
    id: 9,
    tittle: "FANTOM",
    Symbol: "FTM",
    logo: "networks/ftm.png",
  },
  {
    id: 10,
    tittle: "BITTORRET",
    Symbol: "BTT",
    logo: "networks/btt.png",
  },
  {
    id: 11,
    tittle: "HARMONY",
    Symbol: "ETH",
    logo: "networks/one.png",
  },
  {
    id: 12,
    tittle: "MONERO",
    Symbol: "XMR",
    logo: "networks/xmr.png",
  },
];

const taskData = [
  {
    id: 1,
    tittle: "Follow us on X",
    rewardAmount: 10000,
    Url: "https://x.com/minerdog_fun",
    imgUrl: "task/x.png",
    group: "specials",
  },
  {
    id: 2,
    tittle: "Follow Our Partner on X",
    rewardAmount: 15000,
    Url: "https://x.com/otgalaxy_defi",
    imgUrl: "task/x.png",
    group: "specials",
  },
  {
    id: 3,
    tittle: "Follow us on telegram",
    rewardAmount: 15000,
    Url: "https://t.me/minerdog_official",
    imgUrl: "task/tg.jpeg",
    group: "specials",
  },
  {
    id: 4,
    tittle: "Follow us on youtube",
    rewardAmount: 50000,
    Url: "https://www.youtube.com/@minerdoge_fun",
    imgUrl: "task/yt.jpeg",
    group: "specials",
  },
  {
    id: 5,
    tittle: "invite 2 friends",
    rewardAmount: 20000,
    requirment:2,
    imgUrl: "task/2.png",
    group: "refral",
  },
  {
    id: 6,
    tittle: "invite 5 friends",
    rewardAmount: 100000,
    requirment:5,
    imgUrl: "task/5.png",
    group: "refral",
  },
  {
    id: 7,
    tittle: "invite 10 friends",
    rewardAmount: 200000,
    requirment:10,
    imgUrl: "task/10.png",
    group: "refral",
  },
  {
    id: 8,
    tittle: "invite 100 friends",
    rewardAmount: 2500000,
    requirment:100,
    imgUrl: "task/100.png",
    group: "refral",
  },
];

const dailyRewardData = [
  {
    day: 1,
    rewardAmount: 500,
  },
  {
    day: 2,
    rewardAmount: 1000,
  },
  {
    day: 3,
    rewardAmount: 2500,
  },
  {
    day: 4,
    rewardAmount: 5000,
  },
  {
    day: 5,
    rewardAmount: 15000,
  },
  {
    day: 6,
    rewardAmount: 25000,
  },
  {
    day: 7,
    rewardAmount: 100000,
  },
  {
    day: 8,
    rewardAmount: 500000,
  },
  {
    day: 9,
    rewardAmount: 1000000,
  },
  {
    day: 10,
    rewardAmount: 5000000,
  },
];

const rankData = [
  {
    id: 1,
    tittle: "Rank 1",
    imageUrl: "ranks/rank1.png",
    requiredAmount: 0,
    RefralAmount: 5000,
    premiumReferalAmount: 10000,
  },
  {
    id: 2,
    tittle: "Rank 2",
    imageUrl: "ranks/rank2.png",
    requiredAmount: 80000,
    RefralAmount: 15000,
    premiumReferalAmount: 30000,
  },
  {
    id: 3,
    tittle: "Rank 3",
    imageUrl: "ranks/rank3.png",
    requiredAmount: 200000,
    RefralAmount: 25000,
    premiumReferalAmount: 50000,
  },
  {
    id: 4,
    tittle: "Rank 4",
    imageUrl: "ranks/rank4.png",
    requiredAmount: 2000000,
    RefralAmount: 50000,
    premiumReferalAmount: 100000,
  },
  {
    id: 5,
    tittle: "Rank 5",
    imageUrl: "ranks/rank5.png",
    requiredAmount: 10000000,
    RefralAmount: 100000,
    premiumReferalAmount: 200000,
  },
  {
    id: 6,
    tittle: "Rank 6",
    imageUrl: "ranks/rank6.png",
    requiredAmount: 50000000,
    RefralAmount: 250000,
    premiumReferalAmount: 500000,
  },
  {
    id: 7,
    tittle: "Rank 7",
    imageUrl: "ranks/rank7.png",
    requiredAmount: 250000000,
    RefralAmount: 500000,
    premiumReferalAmount: 1000000,
  },
  {
    id: 8,
    tittle: "Rank 8",
    imageUrl: "ranks/rank8.png",
    requiredAmount: 500000000,
    RefralAmount: 1000000,
    premiumReferalAmount: 2000000,
  },
  {
    id: 9,
    tittle: "Rank 9",
    imageUrl: "ranks/rank9.png",
    requiredAmount: 1000000000,
    RefralAmount: 2500000,
    premiumReferalAmount: 5000000,
  },
];

const boosterData = [
  {
    id: 1,
    name: "Multi Tap",
    imgUrl: "booster/ponit_down.png",
    levelAmount: [
      { level: 1, buyingPrice: 800, buffIncrement: 1 },
      { level: 2, buyingPrice: 1400, buffIncrement: 1 },
      { level: 3, buyingPrice: 2600, buffIncrement: 1 },
      { level: 4, buyingPrice: 4700, buffIncrement: 1 },
      { level: 5, buyingPrice: 8400, buffIncrement: 1 },
      { level: 6, buyingPrice: 15000, buffIncrement: 1 },
      { level: 7, buyingPrice: 27000, buffIncrement: 1 },
      { level: 8, buyingPrice: 49000, buffIncrement: 1 },
      { level: 9, buyingPrice: 89000, buffIncrement: 1 },
      { level: 10, buyingPrice: 160000, buffIncrement: 1 },
      { level: 11, buyingPrice: 280000, buffIncrement: 1 },
      { level: 12, buyingPrice: 510000, buffIncrement: 1 },
      { level: 13, buyingPrice: 920000, buffIncrement: 1 },
      { level: 14, buyingPrice: 1600000, buffIncrement: 1 },
      { level: 15, buyingPrice: 3000000, buffIncrement: 1 },
      { level: 16, buyingPrice: 5000000, buffIncrement: 1 },
      { level: 17, buyingPrice: 10000000, buffIncrement: 1 },
      { level: 18, buyingPrice: 20000000, buffIncrement: 1 },
    ],
    maxLevel: 18,
  },
  {
    id: 2,
    name: "Energy Limit",
    imgUrl: "booster/batttery.png",
    levelAmount: [
      { level: 1, buyingPrice: 2000, buffIncrement: 250 },
      { level: 2, buyingPrice: 4200, buffIncrement: 250 },
      { level: 3, buyingPrice: 9000, buffIncrement: 250 },
      { level: 4, buyingPrice: 16000, buffIncrement: 250 },
      { level: 5, buyingPrice: 32000, buffIncrement: 250 },
      { level: 6, buyingPrice: 64000, buffIncrement: 250 },
      { level: 7, buyingPrice: 120000, buffIncrement: 250 },
      { level: 8, buyingPrice: 240000, buffIncrement: 250 },
      { level: 9, buyingPrice: 480000, buffIncrement: 250 },
      { level: 10, buyingPrice: 900000, buffIncrement: 250 },
      { level: 11, buyingPrice: 1800000, buffIncrement: 250 },
      { level: 12, buyingPrice: 3200000, buffIncrement: 250 },
    ],
    maxLevel: 12,
  },
  {
    id: 3,
    name: "Recharge Speed",
    imgUrl: "booster/zap.png",
    levelAmount: [
      { level: 1, buyingPrice: 8000, buffIncrement: 1 },
      { level: 2, buyingPrice: 16000, buffIncrement: 1 },
      { level: 3, buyingPrice: 32000, buffIncrement: 1 },
      { level: 4, buyingPrice: 64000, buffIncrement: 1 },
      { level: 5, buyingPrice: 120000, buffIncrement: 1 },
    ],
    maxLevel: 5,
  },
];

const minerData = [
  {
    id: 1,
    group: "UPGRADES",
    name: "MINING AXE",
    imgUrl: "mining/axe.jpeg",
    maxLevel: 8,
    levelAmount: [
      { level: 1, buyingPrice: 8000, miningRate: 280 },
      { level: 2, buyingPrice: 14000, miningRate: 320 },
      { level: 3, buyingPrice: 26000, miningRate: 360 },
      { level: 4, buyingPrice: 47000, miningRate: 400 },
      { level: 5, buyingPrice: 84000, miningRate: 440 },
      { level: 6, buyingPrice: 150000, miningRate: 480 },
      { level: 7, buyingPrice: 270000, miningRate: 520 },
      { level: 8, buyingPrice: 490000, miningRate: 560 },
    ],
    enabled: true,
  },
  {
    id: 2,
    group: "UPGRADES",
    name: "MINER BOY",
    imgUrl: "mining/miner.jpeg",
    maxLevel: 8,
    levelAmount: [
      { level: 1, buyingPrice: 22000, miningRate: 860 },
      { level: 2, buyingPrice: 40000, miningRate: 900 },
      { level: 3, buyingPrice: 71000, miningRate: 940 },
      { level: 4, buyingPrice: 130000, miningRate: 980 },
      { level: 5, buyingPrice: 230000, miningRate: 1020 },
      { level: 6, buyingPrice: 420000, miningRate: 1060 },
      { level: 7, buyingPrice: 750000, miningRate: 1100 },
      { level: 8, buyingPrice: 1300000, miningRate: 1140 },
    ],
    enabled: true,
  },
  {
    id: 3,
    group: "UPGRADES",
    name: "MINER CPU",
    imgUrl: "mining/cpu.jpeg",
    maxLevel: 8,
    levelAmount: [
      { level: 1, buyingPrice: 44000, miningRate: 1800 },
      { level: 2, buyingPrice: 79000, miningRate: 1840 },
      { level: 3, buyingPrice: 140000, miningRate: 1880 },
      { level: 4, buyingPrice: 260000, miningRate: 1920 },
      { level: 5, buyingPrice: 460000, miningRate: 1960 },
      { level: 6, buyingPrice: 830000, miningRate: 2000 },
      { level: 7, buyingPrice: 1500000, miningRate: 2040 },
      { level: 8, buyingPrice: 2700000, miningRate: 2080 },
    ],
    enabled: true,
  },
  {
    id: 4,
    group: "UPGARDES",
    name: "MINER RIGS",
    imgUrl: "mining/rigs.jpeg",
    maxLevel: 8,
    levelAmount: [
      { level: 1, buyingPrice: 72000, miningRate: 2200 },
      { level: 2, buyingPrice: 130000, miningRate: 2240 },
      { level: 3, buyingPrice: 230000, miningRate: 2280 },
      { level: 4, buyingPrice: 420000, miningRate: 2320 },
      { level: 5, buyingPrice: 760000, miningRate: 2360 },
      { level: 6, buyingPrice: 1400000, miningRate: 2400 },
      { level: 7, buyingPrice: 2400000, miningRate: 2440 },
      { level: 8, buyingPrice: 4400000, miningRate: 2480 },
    ],
    enabled: true,
  },
  {
    id: 5,
    group: "UPGRADES",
    name: "MINING SERVER",
    imgUrl: "mining/server.jpeg",
    maxLevel: 8,
    levelAmount: [
      { level: 1, buyingPrice: 160000, miningRate: 2800 },
      { level: 2, buyingPrice: 290000, miningRate: 2840 },
      { level: 3, buyingPrice: 520000, miningRate: 2880 },
      { level: 4, buyingPrice: 930000, miningRate: 2920 },
      { level: 5, buyingPrice: 1700000, miningRate: 2960 },
      { level: 6, buyingPrice: 3000000, miningRate: 3000 },
      { level: 7, buyingPrice: 5400000, miningRate: 3040 },
      { level: 8, buyingPrice: 9800000, miningRate: 3080 },
    ],
    enabled: true,
  },
];

const addSeedData = async () => {
  try {
    await databaseConnection();
    console.log("removing all existing data...");
    await taskSchema.deleteMany();
    // await networkSchema.deleteMany();
    // await rankSchema.deleteMany();
    // await dailyRewardSchema.deleteMany();
    // await boosterSchema.deleteMany();
    // await powerUpsSchema.deleteMany();
    // await userSchema.deleteMany();
    console.log("adding new data...");
    // await networkSchema.insertMany(networks);
    await taskSchema.insertMany(taskData);
    // await dailyRewardSchema.insertMany(dailyRewardData);
    // await rankSchema.insertMany(rankData);
    // await boosterSchema.insertMany(boosterData);
    // await powerUpsSchema.insertMany(minerData);
    console.log("added data successfully...");
  } catch (error) {
    console.log("err", error);
  }
  process.exit(1);
};

addSeedData();
