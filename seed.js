import mongoose from "mongoose";
import taskSchema from "./database/schema/task.Schema.js";
import networkSchema from "./database/schema/network.schema.js";
import rankSchema from "./database/schema/ranks.schema.js";
import dailyRewardSchema from "./database/schema/dailyReward.Schema.js";
import boosterSchema from "./database/schema/booster.Schema.js";
import powerUpsSchema from "./database/schema/powerUps.schema.js";
import userSchema from "./database/schema/user.Schema.js";
import SecretCodeSchema from "./database/schema/SecretCode.Schema.js";

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
    requirment: 2,
    imgUrl: "task/2.png",
    group: "refral",
  },
  {
    id: 6,
    tittle: "invite 5 friends",
    rewardAmount: 100000,
    requirment: 5,
    imgUrl: "task/5.png",
    group: "refral",
  },
  {
    id: 7,
    tittle: "invite 10 friends",
    rewardAmount: 200000,
    requirment: 10,
    imgUrl: "task/10.png",
    group: "refral",
  },
  {
    id: 8,
    tittle: "invite 100 friends",
    rewardAmount: 2500000,
    requirment: 100,
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
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 5000, miningRate: 100 },
      { level: 2, buyingPrice: 15000, miningRate: 220 },
      { level: 3, buyingPrice: 35000, miningRate: 480 },
      { level: 4, buyingPrice: 70000, miningRate: 1000 },
      { level: 5, buyingPrice: 150000, miningRate: 2100 },
      { level: 6, buyingPrice: 300000, miningRate: 4500 },
    ],
    enabled: true,
  },
  {
    id: 2,
    group: "UPGRADES",
    name: "MINER BOY",
    imgUrl: "mining/miner.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 10000, miningRate: 200 },
      { level: 2, buyingPrice: 30000, miningRate: 440 },
      { level: 3, buyingPrice: 70000, miningRate: 960 },
      { level: 4, buyingPrice: 150000, miningRate: 2100 },
      { level: 5, buyingPrice: 300000, miningRate: 4500 },
      { level: 6, buyingPrice: 600000, miningRate: 10000 },
    ],
    enabled: true,
  },
  {
    id: 3,
    group: "UPGRADES",
    name: "MINER CPU",
    imgUrl: "mining/cpu.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 15000, miningRate: 300 },
      { level: 2, buyingPrice: 45000, miningRate: 660 },
      { level: 3, buyingPrice: 100000, miningRate: 1440 },
      { level: 4, buyingPrice: 200000, miningRate: 3100 },
      { level: 5, buyingPrice: 400000, miningRate: 6500 },
      { level: 6, buyingPrice: 800000, miningRate: 14000 },
    ],
    enabled: true,
  },
  {
    id: 4,
    group: "UPGRADES",
    name: "MINING LAPTOP",
    imgUrl: "mining/laptop.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 20000, miningRate: 400 },
      { level: 2, buyingPrice: 60000, miningRate: 880 },
      { level: 3, buyingPrice: 130000, miningRate: 1920 },
      { level: 4, buyingPrice: 250000, miningRate: 4100 },
      { level: 5, buyingPrice: 500000, miningRate: 8700 },
      { level: 6, buyingPrice: 1000000, miningRate: 18500 },
    ],
    enabled: true,
  },
  {
    id: 5,
    group: "UPGRADES",
    name: "MINING SERVER",
    imgUrl: "mining/server.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 25000, miningRate: 500 },
      { level: 2, buyingPrice: 75000, miningRate: 1100 },
      { level: 3, buyingPrice: 150000, miningRate: 2400 },
      { level: 4, buyingPrice: 300000, miningRate: 5000 },
      { level: 5, buyingPrice: 600000, miningRate: 10500 },
      { level: 6, buyingPrice: 1200000, miningRate: 22500 },
    ],
    enabled: true,
  },
  {
    id: 6,
    group: "UPGRADES",
    name: "MINING BOT",
    imgUrl: "mining/bot.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 30000, miningRate: 600 },
      { level: 2, buyingPrice: 90000, miningRate: 1320 },
      { level: 3, buyingPrice: 180000, miningRate: 2900 },
      { level: 4, buyingPrice: 350000, miningRate: 6100 },
      { level: 5, buyingPrice: 700000, miningRate: 13000 },
      { level: 6, buyingPrice: 1400000, miningRate: 27500 },
    ],
    enabled: true,
  },
  {
    id: 7,
    group: "UPGRADES",
    name: "SMALL RIG",
    imgUrl: "mining/small_rig.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 35000, miningRate: 700 },
      { level: 2, buyingPrice: 105000, miningRate: 1540 },
      { level: 3, buyingPrice: 210000, miningRate: 3400 },
      { level: 4, buyingPrice: 420000, miningRate: 7200 },
      { level: 5, buyingPrice: 850000, miningRate: 15000 },
      { level: 6, buyingPrice: 1700000, miningRate: 32000 },
    ],
    enabled: true,
  },
  {
    id: 8,
    group: "UPGRADES",
    name: "MINING HOUSE",
    imgUrl: "mining/house.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 40000, miningRate: 800 },
      { level: 2, buyingPrice: 120000, miningRate: 1760 },
      { level: 3, buyingPrice: 240000, miningRate: 3850 },
      { level: 4, buyingPrice: 480000, miningRate: 8100 },
      { level: 5, buyingPrice: 950000, miningRate: 17000 },
      { level: 6, buyingPrice: 1900000, miningRate: 36000 },
    ],
    enabled: true,
  },
  {
    id: 9,
    group: "UPGRADES",
    name: "MINING WAREHOUSE",
    imgUrl: "mining/warehouse.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 45000, miningRate: 900 },
      { level: 2, buyingPrice: 135000, miningRate: 1980 },
      { level: 3, buyingPrice: 270000, miningRate: 4300 },
      { level: 4, buyingPrice: 540000, miningRate: 9000 },
      { level: 5, buyingPrice: 1100000, miningRate: 19000 },
      { level: 6, buyingPrice: 2200000, miningRate: 40000 },
    ],
    enabled: true,
  },
  {
    id: 10,
    group: "UPGRADES",
    name: "MINING FACILITY",
    imgUrl: "mining/facility.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 50000, miningRate: 1000 },
      { level: 2, buyingPrice: 150000, miningRate: 2200 },
      { level: 3, buyingPrice: 300000, miningRate: 4800 },
      { level: 4, buyingPrice: 600000, miningRate: 10000 },
      { level: 5, buyingPrice: 1200000, miningRate: 21000 },
      { level: 6, buyingPrice: 2400000, miningRate: 45000 },
    ],
    enabled: true,
  },
  {
    id: 11,
    group: "UPGRADES",
    name: "MINING MACHINE",
    imgUrl: "mining/machine.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 55000, miningRate: 1100 },
      { level: 2, buyingPrice: 165000, miningRate: 2420 },
      { level: 3, buyingPrice: 330000, miningRate: 5300 },
      { level: 4, buyingPrice: 660000, miningRate: 11000 },
      { level: 5, buyingPrice: 1300000, miningRate: 23000 },
      { level: 6, buyingPrice: 2600000, miningRate: 48000 },
    ],
    enabled: true,
  },
  {
    id: 12,
    group: "UPGRADES",
    name: "MINING CENTER",
    imgUrl: "mining/center.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 60000, miningRate: 1200 },
      { level: 2, buyingPrice: 180000, miningRate: 2640 },
      { level: 3, buyingPrice: 360000, miningRate: 5800 },
      { level: 4, buyingPrice: 720000, miningRate: 12000 },
      { level: 5, buyingPrice: 1400000, miningRate: 25000 },
      { level: 6, buyingPrice: 2800000, miningRate: 51000 },
    ],
    enabled: true,
  },
  {
    id: 13,
    group: "UPGRADES",
    name: "MINING STATION",
    imgUrl: "mining/station.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 65000, miningRate: 1300 },
      { level: 2, buyingPrice: 195000, miningRate: 2860 },
      { level: 3, buyingPrice: 390000, miningRate: 6300 },
      { level: 4, buyingPrice: 780000, miningRate: 13000 },
      { level: 5, buyingPrice: 1500000, miningRate: 27000 },
      { level: 6, buyingPrice: 3000000, miningRate: 54000 },
    ],
    enabled: true,
  },
  {
    id: 14,
    group: "UPGRADES",
    name: "MINING COMPLEX",
    imgUrl: "mining/complex.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 70000, miningRate: 1400 },
      { level: 2, buyingPrice: 210000, miningRate: 3080 },
      { level: 3, buyingPrice: 420000, miningRate: 6800 },
      { level: 4, buyingPrice: 840000, miningRate: 14000 },
      { level: 5, buyingPrice: 1600000, miningRate: 29000 },
      { level: 6, buyingPrice: 3200000, miningRate: 57000 },
    ],
    enabled: true,
  },
  {
    id: 15,
    group: "UPGRADES",
    name: "MINING TOWER",
    imgUrl: "mining/tower.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 75000, miningRate: 1500 },
      { level: 2, buyingPrice: 225000, miningRate: 3300 },
      { level: 3, buyingPrice: 450000, miningRate: 7300 },
      { level: 4, buyingPrice: 900000, miningRate: 15000 },
      { level: 5, buyingPrice: 1700000, miningRate: 31000 },
      { level: 6, buyingPrice: 3400000, miningRate: 60000 },
    ],
    enabled: true,
  },
  {
    id: 16,
    group: "UPGRADES",
    name: "MINING LAB",
    imgUrl: "mining/lab.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 80000, miningRate: 1600 },
      { level: 2, buyingPrice: 240000, miningRate: 3520 },
      { level: 3, buyingPrice: 480000, miningRate: 7800 },
      { level: 4, buyingPrice: 960000, miningRate: 16000 },
      { level: 5, buyingPrice: 1800000, miningRate: 33000 },
      { level: 6, buyingPrice: 3600000, miningRate: 63000 },
    ],
    enabled: true,
  },
  {
    id: 17,
    group: "UPGRADES",
    name: "MINING SKYLAB",
    imgUrl: "mining/skylab.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 85000, miningRate: 1700 },
      { level: 2, buyingPrice: 255000, miningRate: 3740 },
      { level: 3, buyingPrice: 510000, miningRate: 8300 },
      { level: 4, buyingPrice: 1020000, miningRate: 17000 },
      { level: 5, buyingPrice: 1900000, miningRate: 35000 },
      { level: 6, buyingPrice: 3800000, miningRate: 66000 },
    ],
    enabled: true,
  },
  {
    id: 18,
    group: "UPGRADES",
    name: "BASIC SATELITE",
    imgUrl: "mining/basic_satelite.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 90000, miningRate: 1800 },
      { level: 2, buyingPrice: 270000, miningRate: 3960 },
      { level: 3, buyingPrice: 540000, miningRate: 8800 },
      { level: 4, buyingPrice: 1080000, miningRate: 18000 },
      { level: 5, buyingPrice: 2000000, miningRate: 37000 },
      { level: 6, buyingPrice: 4000000, miningRate: 69000 },
    ],
    enabled: true,
  },
  {
    id: 19,
    group: "UPGRADES",
    name: "ADVANCED SATELITE",
    imgUrl: "mining/advanced_satelite.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 95000, miningRate: 1900 },
      { level: 2, buyingPrice: 285000, miningRate: 4180 },
      { level: 3, buyingPrice: 570000, miningRate: 9300 },
      { level: 4, buyingPrice: 1140000, miningRate: 19000 },
      { level: 5, buyingPrice: 2100000, miningRate: 39000 },
      { level: 6, buyingPrice: 4200000, miningRate: 72000 },
    ],
    enabled: true,
  },
  {
    id: 20,
    group: "UPGRADES",
    name: "SPACE STATION",
    imgUrl: "mining/space_station.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 100000, miningRate: 2000 },
      { level: 2, buyingPrice: 300000, miningRate: 4400 },
      { level: 3, buyingPrice: 600000, miningRate: 9800 },
      { level: 4, buyingPrice: 1200000, miningRate: 20000 },
      { level: 5, buyingPrice: 2200000, miningRate: 41000 },
      { level: 6, buyingPrice: 4400000, miningRate: 75000 },
    ],
    enabled: true,
  },
  {
    id: 21,
    group: "UPGRADES",
    name: "HACKING SERVER",
    imgUrl: "mining/hacking_server.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 105000, miningRate: 2100 },
      { level: 2, buyingPrice: 315000, miningRate: 4620 },
      { level: 3, buyingPrice: 630000, miningRate: 10300 },
      { level: 4, buyingPrice: 1260000, miningRate: 21000 },
      { level: 5, buyingPrice: 2400000, miningRate: 43000 },
      { level: 6, buyingPrice: 4800000, miningRate: 78000 },
    ],
    enabled: true,
  },
  {
    id: 22,
    group: "UPGRADES",
    name: "HACKING SPACESATION",
    imgUrl: "mining/hacking_spacestation.jpeg",
    maxLevel: 6,
    levelAmount: [
      { level: 1, buyingPrice: 110000, miningRate: 2200 },
      { level: 2, buyingPrice: 330000, miningRate: 4840 },
      { level: 3, buyingPrice: 660000, miningRate: 10800 },
      { level: 4, buyingPrice: 1320000, miningRate: 22000 },
      { level: 5, buyingPrice: 2500000, miningRate: 45000 },
      { level: 6, buyingPrice: 5000000, miningRate: 81000 },
    ],
    enabled: true,
  },
];

const secretCodeData = [
  {
    currentCode:7777,
    rewardAmount:1000000
  }
]

const addSeedData = async () => {
  try {
    await databaseConnection();
    console.log("removing all existing data...");
    // await taskSchema.deleteMany();
    // await networkSchema.deleteMany();
    // await rankSchema.deleteMany();
    // await dailyRewardSchema.deleteMany();
    // await boosterSchema.deleteMany();
    // await powerUpsSchema.deleteMany();
    // await userSchema.deleteMany();
    console.log("adding new data...");
    // await networkSchema.insertMany(networks);
    // await taskSchema.insertMany(taskData);
    // await dailyRewardSchema.insertMany(dailyRewardData);
    // await rankSchema.insertMany(rankData);
    // await boosterSchema.insertMany(boosterData);
    // await powerUpsSchema.insertMany(minerData);
    // await SecretCodeSchema.insertMany(secretCodeData)
    console.log("added data successfully...");
  } catch (error) {
    console.log("err", error);
  }
  process.exit(1);
};

addSeedData();
