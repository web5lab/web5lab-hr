import {
  catchAsync,
  catchAsyncFn,
  httpStatus,
  responseObject,
} from "../utils/helper.js";
import networkSchema from "../database/schema/network.schema.js";
import powerUpsSchema from "../database/schema/powerUps.schema.js";
import taskSchema from "../database/schema/task.Schema.js";
import rankSchema from "../database/schema/ranks.schema.js";
import userSchema from "../database/schema/user.Schema.js";
import dailyRewardSchema from "../database/schema/dailyReward.Schema.js";
import boosterSchema from "../database/schema/booster.Schema.js";
import { calculateMiningAmount } from "../services/miningChecker.js";
import TelegramBot from "node-telegram-bot-api";
import { calculateDaysSpent } from "../services/timerUtils.js";
import { findCurrentRank } from "../services/rankChecker.js";
import SecretCodeSchema from "../database/schema/SecretCode.Schema.js";

const token = "7348203341:AAGEFNyEWz2l4dsJEbE3wwuygV-_9PV7baQ";
export const bot = new TelegramBot(token, { polling: true });

export const telegramService = () => {
  console.log("telegram service started");

  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    console.log(msg);
    bot.sendMessage(chatId, "hi how can i help you");
  });

  bot.onText(/\/users/, async (msg) => {
    const chatId = msg.chat.id;
    const count = await userSchema.countDocuments();
    bot.sendMessage(chatId, `total User Is => ${count}`);
  });

  bot.onText(
    /\/balance/,
    catchAsyncFn(async (msg) => {
      const chatId = msg.chat.id;
      console.log("chat", chatId);
      const count = await userSchema.findOne({ id: Number(chatId) });
      bot.sendMessage(chatId, count.Balance);
    })
  );

  // Handle errors
  bot.on("polling_error", (error) => {
    // console.error(`Polling error: ${error.message}`);
  });

  // Handle other types of errors
  bot.on("error", (error) => {
    // console.error(`Bot error: ${error.message}`);
  });
};

const login = catchAsync(async (req, res) => {
  const {
    id,
    first_name,
    last_name,
    username,
    is_premium,
    chatType,
    instance,
  } = req.userPayload;
  const { reffralId } = req.body;

  if (!id) {
    const err = responseObject(false, true, {
      message: "empty address",
    });
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  let user = await userSchema.findOne({ id: id });

  if (!user) {
    const newUser = new userSchema({
      id,
      userName: username,
      name: `${first_name} ${last_name}`,
      referalId: id,
      MiningRatePerHour: 100,
      lastLoginTime: Date.now(),
    });

    if (chatType === "sender") {
      newUser.instanaceId = instance;
      bot.sendMessage(instance, "hi your account is created");
    }

    if (is_premium) {
      newUser.isPremium = is_premium;
    }

    if (reffralId) {
      newUser.referedBy = reffralId;
      const updateAmount = is_premium ? 1010000 : 1005000;

      const refredUser = await userSchema.findOneAndUpdate(
        { id: reffralId },
        {
          $inc: {
            Balance: updateAmount,
            totalEarning: updateAmount,
            polgonBalance: 0.1,
          },
        }
      );
      const msg = `Hi ${
        refredUser?.userName ? `@${refredUser?.userName}` : refredUser?.name
      } \n\n ${first_name} has joined MinerDoge using your referral! You have been credited with 1 million MinerDoge coins and 0.1 MATIC token in your account.`;
      bot.sendAnimation(
        refredUser.id,
        "https://img.minerdoge.fun/ipfs/bafkreig5kzqg6mkhpry3d5bvkb5v6kfkh3ymmoxcloaekr6sush5326e5i",
        {
          caption: msg,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Game 🎮",
                  url: "https://t.me/minerdogcoin_bot/earn",
                },
              ],
              [
                {
                  text: "Join Community 🌐",
                  url: "https://t.me/minerdoge_official",
                },
              ],
              [
                {
                  text: "Website 🌐",
                  url: "https://minerdoge.fun/",
                },
              ],
            ],
          },
        }
      );
      newUser.Balance = updateAmount - 1000000;
    }

    user = await newUser.save();
  }

  const now = new Date();
  const lastClaimTime = user.dailyTask.timestamp
    ? new Date(user.dailyTask.timestamp)
    : null;
  const nextClaimTime = new Date(now);
  nextClaimTime.setUTCHours(4, 0, 0, 0);
  if (nextClaimTime < now) {
    nextClaimTime.setUTCDate(nextClaimTime.getUTCDate() + 1);
  }

  let minerNotification = null;
  let claimed = false;

  if (user.MiningRatePerHour !== 0) {
    const miningData = calculateMiningAmount(
      user.MiningRatePerHour,
      user.lastMiningTime
    );
    user.lastMiningTime = miningData.lastMiningTime;
    user.Balance += miningData.miningAmount;
    user.totalEarning += miningData.miningAmount;

    minerNotification = { amount: miningData.miningAmount };
  }

  // Adjust reward claim logic
  const dayInMillis = 24 * 60 * 60 * 1000;
  const lastClaimDay = lastClaimTime
    ? Math.floor(lastClaimTime.getTime() / dayInMillis)
    : 0;
  const currentDay = Math.floor(now.getTime() / dayInMillis);
  let rewardDay = user.dailyTask.day;
  let compltedDay = user.dailyTask.day;
  let dailyReward;
  // console.log("days", lastClaimDay, lastClaimTime, currentDay);
  if (!lastClaimTime || lastClaimDay !== currentDay) {
    if (lastClaimDay === currentDay - 1) {
      if (user.dailyTask.day === 10) {
        rewardDay = 1;
        compltedDay = 0;
      } else {
        rewardDay += 1;
      }
    } else {
      rewardDay = 1;
      compltedDay = 0;
    }

    claimed = false;
    dailyReward = {
      rewardStreak: rewardDay,
      compltedDay: compltedDay,
      claimed: claimed,
    };
  } else {
    dailyReward = {
      claimed: true,
      compltedDay: rewardDay,
      rewardStreak: 0,
    };
  }

  if (calculateDaysSpent(user.lastLoginTime) >= 1) {
    user.powerUps.boost.remaining = 3;
    user.powerUps.refill.used = false;
  }

  const rank = findCurrentRank(user.Balance);
  if (rank.id > user.currentRank) {
    user.currentRank = rank.id;
    const referalAmount = user.isPremium
      ? rank.premiumReferalAmount
      : rank.RefralAmount;
    if (user.referedBy !== 0) {
      await userSchema.findOneAndUpdate(
        { id: user.referedBy },
        {
          $inc: {
            Balance: referalAmount,
            totalEarning: referalAmount,
          },
        }
      );
    }
  }

  if (instance !== user.instanaceId) {
    if (instance !== 0) {
      user.instanaceId = instance;
    }
  }

  user.lastLoginTime = Date.now();
  await user.save();

  const response = responseObject(true, false, {
    data: user,
    dailyReward,
    minerNotification: minerNotification,
    claimed,
    message: "fetched successfully",
  });

  return res.status(httpStatus.OK).json(response);
});

const compltetTask = catchAsync(async (req, res) => {
  const { id } = req.userPayload;
  const { taskId } = req.body;

  if (!id) {
    const err = responseObject(false, true, {
      message: "empty params",
    });
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }
  const user = await userSchema.findOne({ id: id });
  if (!user) {
    const err = responseObject(false, true, {
      message: "user not found",
    });
    return res.status(httpStatus.NOT_FOUND).json(err);
  }
  const task = await taskSchema.findOne({ id: Number(taskId) });
  if (!task) {
    // console.log("task", task);
    const err = responseObject(false, true, {
      message: "task not exist",
    });
    return res.status(httpStatus.NOT_FOUND).json(err);
  }

  if (user.completedTask.includes(taskId)) {
    const err = responseObject(false, true, {
      message: "task already complted",
    });
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }
  user.completedTask.push(taskId);
  user.Balance += task.rewardAmount;
  user.totalEarning += task.rewardAmount;
  await user.save();
  const successResponse = responseObject(true, false, {
    taskId: taskId,
    coinToAdd: task.rewardAmount,
    message: "Task completed successfully",
  });
  return res.status(httpStatus.OK).json(successResponse);
});

const buyMiner = catchAsync(async (req, res) => {
  const { id } = req.userPayload;
  const { minerId } = req.body;

  if (!id || !minerId) {
    console.log("m", id, minerId);
    const err = responseObject(false, true, {
      message: "empty params",
    });
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  const user = await userSchema.findOne({ id: id });
  if (!user) {
    const err = responseObject(false, true, {
      message: "user not found",
    });
    return res.status(httpStatus.NOT_FOUND).json(err);
  }

  const powerUp = await powerUpsSchema.findOne({ id: minerId });
  if (!powerUp || !powerUp.enabled) {
    const err = responseObject(false, true, {
      message: "power-up not found or not enabled",
    });
    return res.status(httpStatus.NOT_FOUND).json(err);
  }

  // Check if user already has this power-up and its current level
  // console.log(user.miningCards);
  // const err = responseObject(false, true, {
  //   data:user.miningCards,
  //   message: "power-up not found or not enabled",
  // });
  // return res.status(httpStatus.NOT_FOUND).json(err);
  // return

  let userPowerUp = user.miningCards.find((b) => b.id === minerId) || {
    id: minerId,
    level: 0,
  };

  // Determine the next level and its price
  const nextLevel = userPowerUp.level + 1;
  const levelDetails = powerUp.levelAmount.find((l) => l.level === nextLevel);

  if (!levelDetails) {
    const err = responseObject(false, true, {
      message: "power-up max level reached",
    });
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  if (user.MiningRatePerHour != 0) {
    const miningData = calculateMiningAmount(
      user.MiningRatePerHour,
      user.lastMiningTime
    );
    user.lastMiningTime = miningData.lastMiningTime;
    user.Balance += miningData.miningAmount;
    user.totalEarning += miningData.miningAmount;
  }

  const { buyingPrice } = levelDetails;
  if (user.Balance < buyingPrice) {
    const err = responseObject(false, true, {
      message: "insufficient balance",
    });
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  let hashAdded;

  if (nextLevel != 1) {
    const previousLevelDetails = powerUp.levelAmount.find(
      (l) => l.level === nextLevel - 1
    );
    const hashtoAdd = levelDetails.miningRate - previousLevelDetails.miningRate;
    hashAdded = levelDetails.miningRate - previousLevelDetails.miningRate;
    user.MiningRatePerHour += hashtoAdd;
  }

  if (nextLevel === 1) {
    user.MiningRatePerHour += levelDetails.miningRate;
    hashAdded = levelDetails.miningRate;
  }

  // Deduct the price from user's balance and update power-up level
  user.Balance -= buyingPrice;
  userPowerUp.level = nextLevel;

  const existingMinerIndex = user.miningCards.findIndex(
    (b) => b.id === minerId
  );
  if (existingMinerIndex !== -1) {
    user.miningCards[existingMinerIndex] = userPowerUp;
    console.log("log", user.miningCards);
  } else {
    user.miningCards.push(userPowerUp);
    console.log("log 2", userPowerUp);
  }

  console.log("log 3", user.miningCards);

  await user.save();

  const successResponse = responseObject(true, false, {
    hashAdded: hashAdded,
    balanceToDeduct: buyingPrice,
    userMiningCard: user.miningCards,
    message: "Power-up bought/upgraded successfully",
  });
  return res.status(httpStatus.OK).json(successResponse);
});

const buyBooster = catchAsync(async (req, res) => {
  const { id } = req.userPayload;
  const { boosterId } = req.body;

  if (!id || !boosterId) {
    const err = responseObject(false, true, {
      message: "empty params",
    });
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  const user = await userSchema.findOne({ id: id });
  if (!user) {
    const err = responseObject(false, true, {
      message: "user not found",
    });
    return res.status(httpStatus.NOT_FOUND).json(err);
  }

  const booster = await boosterSchema.findOne({ id: boosterId });
  if (!booster || !booster.enabled) {
    const err = responseObject(false, true, {
      message: "booster not found or not enabled",
    });
    return res.status(httpStatus.NOT_FOUND).json(err);
  }

  // Check if user already has this booster and its current level
  let userBooster = user.boosterCrads.find((b) => b.id === boosterId) || {
    id: boosterId,
    level: 0,
  };

  // console.log("user", userBooster);

  // Determine the next level and its price
  const nextLevel = userBooster.level + 1;
  const levelDetails = booster.levelAmount.find((l) => l.level === nextLevel);
  if (!levelDetails) {
    const err = responseObject(false, true, {
      message: "booster max level reached",
    });
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  if (user.MiningRatePerHour != 0) {
    const miningData = calculateMiningAmount(
      user.MiningRatePerHour,
      user.lastMiningTime
    );
    user.lastMiningTime = miningData.lastMiningTime;
    user.Balance += miningData.miningAmount;
    user.totalEarning += miningData.miningAmount;
  }

  const { buyingPrice } = levelDetails;
  if (user.Balance < buyingPrice) {
    const err = responseObject(false, true, {
      message: "insufficient balance",
    });
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  // Deduct the price from user's balance and update booster level
  user.Balance -= buyingPrice;
  userBooster.level = nextLevel;

  // Update or add the booster in user's boosterCrads array
  const existingBoosterIndex = user.boosterCrads.findIndex(
    (b) => b.id === boosterId
  );
  if (existingBoosterIndex !== -1) {
    user.boosterCrads[existingBoosterIndex] = userBooster;
  } else {
    user.boosterCrads.push(userBooster);
  }
  let type;
  if (boosterId === 1) {
    type = "Clicks";
    user.earnPerclicks += levelDetails.buffIncrement;
  }
  if (boosterId === 2) {
    type = "RechargeLimit";
    user.rechargeLimit += levelDetails.buffIncrement;
  }
  if (boosterId === 3) {
    type = "RechargeRate";
    user.rechargeRate += levelDetails.buffIncrement;
  }

  await user.save();

  const successResponse = responseObject(true, false, {
    type: type,
    userCard: user.boosterCrads,
    balanceToDeduct: buyingPrice,
    buffIncrement: levelDetails.buffIncrement,
    message: "Booster bought/upgraded successfully",
  });
  return res.status(httpStatus.OK).json(successResponse);
});

const addClicks = catchAsync(async (req, res) => {
  const { id } = req.userPayload;
  const { clicks } = req.body;
  if (!id) {
    const err = responseObject(false, true, {
      message: "empty params",
    });
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }
  const user = await userSchema.findOne({ id: id });
  if (!user) {
    const err = responseObject(false, true, {
      message: "user not found",
    });
    return res.status(httpStatus.NOT_FOUND).json(err);
  }
  const coins = clicks * user.earnPerclicks;
  user.Balance += coins;
  user.totalEarning += coins;
  await user.save();
  const response = responseObject(true, false, {
    data: coins,
    message: "fetched successfully",
  });
  return res.status(httpStatus.OK).json(response);
});

const claimSecretReward = catchAsync(async (req, res) => {
  const { id } = req.userPayload;
  const { code } = req.body;
  if (!id) {
    const err = responseObject(false, true, {
      message: "empty params",
    });
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }
  const user = await userSchema.findOne({ id: id });
  if (!user) {
    const err = responseObject(false, true, {
      message: "user not found",
    });
    return res.status(httpStatus.NOT_FOUND).json(err);
  }
  const coins = 1000;
  user.Balance += coins;
  user.totalEarning += coins;
  await user.save();
  const response = responseObject(true, false, {
    data: coins,
    message: "fetched successfully",
  });
  return res.status(httpStatus.OK).json(response);
});

const dailyLogin = catchAsync(async (req, res) => {
  const { id } = req.userPayload;
  if (!id) {
    const err = responseObject(false, true, {
      message: "empty params",
    });
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }
  const user = await userSchema.findOne({ id: id });
  if (!user) {
    const err = responseObject(false, true, {
      message: "user not found",
    });
    return res.status(httpStatus.NOT_FOUND).json(err);
  }
  const now = new Date();
  const lastClaimTime = user.dailyTask.timestamp
    ? new Date(user.dailyTask.timestamp)
    : null;
  const nextClaimTime = new Date(now);
  nextClaimTime.setUTCHours(4, 0, 0, 0);
  if (nextClaimTime < now) {
    nextClaimTime.setUTCDate(nextClaimTime.getUTCDate() + 1);
  }

  // Adjust reward claim logic
  const dayInMillis = 24 * 60 * 60 * 1000;
  const lastClaimDay = lastClaimTime
    ? Math.floor(lastClaimTime.getTime() / dayInMillis)
    : 0;
  const currentDay = Math.floor(now.getTime() / dayInMillis);

  if (!lastClaimTime || lastClaimDay !== currentDay) {
    if (lastClaimDay === currentDay - 1) {
      if (user.dailyTask.day === 10) {
        user.dailyTask.day = 1;
      } else {
        user.dailyTask.day += 1;
      }
    } else {
      user.dailyTask.day = 1;
    }
  } else {
    const err = responseObject(false, true, {
      message: "reward alredy claimed",
    });
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  const rewardData = await dailyRewardSchema.findOne({
    day: user.dailyTask.day,
  });

  if (!rewardData) {
    const err = responseObject(false, true, {
      message: "reward not found",
    });
    return res.status(httpStatus.NOT_FOUND).json(err);
  }
  user.Balance += rewardData.rewardAmount;
  user.totalEarning += rewardData.rewardAmount;
  user.dailyTask.timestamp = Date.now();
  await user.save();
  const response = responseObject(true, false, {
    day: user.dailyTask.day,
    claimed: true,
    balanceToAdd: rewardData.rewardAmount,
    message: "reward claimed succesfully",
  });
  return res.status(httpStatus.OK).json(response);
});

const changeNetwork = catchAsync(async (req, res) => {
  const { id } = req.userPayload;
  const { network } = req.body;
  if (!id) {
    const err = responseObject(false, true, {
      message: "empty params",
    });
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }
  const user = await userSchema.findOne({ id: id });
  if (!user) {
    const err = responseObject(false, true, {
      message: "user not found",
    });
    return res.status(httpStatus.NOT_FOUND).json(err);
  }
  user.currentNetwork = network;
  await user.save();
  const response = responseObject(true, false, {
    data: network,
    message: "network changed succesfully",
  });
  return res.status(httpStatus.OK).json(response);
});

const getTask = catchAsync(async (req, res) => {
  const task = await taskSchema.aggregate([
    {
      $match: {},
    },
    {
      $sort: { id: 1 },
    },
    {
      $facet: {
        special: [
          { $match: { group: "specials" } },
          {
            $group: {
              _id: "$group",
              tasks: {
                $push: {
                  id: "$id",
                  tittle: "$tittle",
                  discription: "$discription",
                  rewardAmount: "$rewardAmount",
                  requirment: "$requirment",
                  Url: "$Url",
                  imgUrl: "$imgUrl",
                  enabled: "$enabled",
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              group: "$_id",
              tasks: 1,
            },
          },
        ],
        referal: [
          { $match: { group: "refral" } },
          {
            $group: {
              _id: "$group",
              tasks: {
                $push: {
                  id: "$id",
                  tittle: "$tittle",
                  discription: "$discription",
                  rewardAmount: "$rewardAmount",
                  requirment: "$requirment",
                  Url: "$Url",
                  imgUrl: "$imgUrl",
                  enabled: "$enabled",
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              group: "$_id",
              tasks: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        data: { $concatArrays: ["$special", "$referal"] },
      },
    },
    {
      $unwind: "$data",
    },
    {
      $replaceRoot: { newRoot: "$data" },
    },
  ]);

  const response = responseObject(true, false, {
    data: task,
    message: "fetched successfully",
  });
  return res.status(httpStatus.OK).json(response);
});

const getNetworks = catchAsync(async (req, res) => {
  const networks = await networkSchema.aggregate([
    {
      $sort: { id: 1 },
    },
    {
      $project: {
        _id: 0,
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    },
  ]);
  const response = responseObject(true, false, {
    networks: networks,
    message: "Networks fetched successfully",
  });
  return res.status(httpStatus.OK).json(response);
});

const getminingPowerUps = catchAsync(async (req, res) => {
  const miningPowerUps = await powerUpsSchema.aggregate([
    {
      $match: {},
    },
    {
      $sort: { id: 1 },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);
  const response = responseObject(true, false, {
    data: miningPowerUps,
    message: "fetched successfully",
  });
  return res.status(httpStatus.OK).json(response);
});

const getBoosters = catchAsync(async (req, res) => {
  const miningPowerUps = await boosterSchema.aggregate([
    {
      $match: {},
    },
    {
      $sort: { id: 1 },
    },
    {
      $project: {
        _id: 0,
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    },
  ]);
  const response = responseObject(true, false, {
    data: miningPowerUps,
    message: "fetched successfully",
  });
  return res.status(httpStatus.OK).json(response);
});

const getRefralFrineds = catchAsync(async (req, res) => {
  const { id } = req.userPayload;
  if (!id) {
    const err = responseObject(false, true, {
      message: "empty params",
    });
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }

  const friends = await userSchema.aggregate([
    {
      $match: {
        id: id,
      },
    },
    {
      $lookup: {
        from: "users", // Ensure the collection name matches your actual user collection name
        localField: "referalId",
        foreignField: "referedBy",
        as: "referrals",
      },
    },
    {
      $lookup: {
        from: "users", // Ensure the collection name matches your actual user collection name
        localField: "referedBy",
        foreignField: "id",
        as: "referredByDetails",
      },
    },
    {
      $addFields: {
        referralCount: { $size: "$referrals" }, // Calculate the length of the referrals array
      },
    },
    {
      $project: {
        _id: 0,
        referralCount: 1, // Include the referral count in the projection
        friends: {
          $concatArrays: [
            {
              $map: {
                input: "$referredByDetails",
                as: "referredByDetail",
                in: {
                  name: "$$referredByDetail.name",
                  Balance: "$$referredByDetail.totalEarning",
                  rank: "$$referredByDetail.currentRank",
                },
              },
            },
            {
              $map: {
                input: "$referrals",
                as: "referral",
                in: {
                  name: "$$referral.name",
                  Balance: "$$referral.totalEarning",
                  rank: "$$referral.currentRank",
                },
              },
            },
          ],
        },
      },
    },
  ]);

  const response = responseObject(true, false, {
    data: friends[0],
    message: "fetched successfully",
  });
  return res.status(httpStatus.OK).json(response);
});

const getRanks = catchAsync(async (req, res) => {
  const ranks = await rankSchema.aggregate([
    {
      $match: {},
    },
    {
      $sort: { id: 1 },
    },
    {
      $project: {
        _id: 0,
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    },
  ]);
  const response = responseObject(true, false, {
    data: ranks,
    message: "fetched successfully",
  });
  return res.status(httpStatus.OK).json(response);
});

const getRanksLeaderBoard = catchAsync(async (req, res) => {
  const { rank } = req.params;
  const limit = parseInt(req.query.limit) || 40;
  const ranks = await userSchema.aggregate([
    {
      $match: { currentRank: Number(rank) },
    },
    {
      $sort: { Balance: 1 },
    },
    {
      $limit: limit,
    },
    {
      $project: {
        _id: 0,
        Balance: 1,
        currentNetwork: 1,
        name: 1,
      },
    },
  ]);
  const response = responseObject(true, false, {
    data: ranks.reverse(),
    message: "fetched successfully",
  });
  return res.status(httpStatus.OK).json(response);
});

const getDailyLoginRewards = catchAsync(async (req, res) => {
  const daily = await dailyRewardSchema.aggregate([
    {
      $match: {},
    },
    {
      $sort: { day: 1 },
    },
    {
      $project: {
        _id: 0,
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    },
  ]);
  const response = responseObject(true, false, {
    data: daily,
    message: "fetched successfully",
  });
  return res.status(httpStatus.OK).json(response);
});

const getSecretCode = catchAsync(async (req, res) => {
  const secretCode = await SecretCodeSchema.findOne({ id: 1 });
  const response = responseObject(true, false, {
    data: secretCode,
    message: "fetched successfully",
  });
  return res.status(httpStatus.OK).json(response);
});

const sendNotifiactionTelegram = catchAsync(async (req, res) => {
  const { message, secretId, imageUrl } = req.body;
  if (secretId !== "shiva") {
    const err = responseObject(false, true, {
      message: "UNAUTHORIZED",
    });
    return res.status(httpStatus.UNAUTHORIZATION).json(err);
  }
  const users = await userSchema.aggregate([
    {
      $project: {
        _id: 0,
        id: 1,
        userName: 1,
        name: 1,
      },
    },
  ]);

  

  for (let index = 0; index < users.length; index++) {
    const msg = `Hi ${
      users[index]?.userName ? `@${users[index]?.userName}` : users[index]?.name
    } \n ${message}`;
    bot.sendAnimation(users[index]?.id, imageUrl, {
      caption: msg,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Game 🎮",
              url: "https://t.me/minerdogcoin_bot/earn",
            },
          ],
          [
            {
              text: "Join Community 🌐",
              url: "https://t.me/minerdoge_official",
            },
          ],
          [
            {
              text: "Website 🌐",
              url: "https://minerdoge.fun/",
            },
          ],
        ],
      },
    });
  }

  const response = responseObject(true, false, {
    data: users,
    message: "fetched successfully",
  });
  return res.status(httpStatus.OK).json(response);
});

const sendUpdateTelegram = catchAsync(async (req, res) => {
  const { message, secretId, imageUrl } = req.body;
  if (secretId !== "shiva") {
    const err = responseObject(false, true, {
      message: "UNAUTHORIZED",
    });
    return res.status(httpStatus.UNAUTHORIZATION).json(err);
  }
  const users = await userSchema.aggregate([
    {
      $project: {
        _id: 0,
        id: 1,
        userName: 1,
        name: 1,
      },
    },
  ]);

  for (let index = 0; index < users.length; index++) {
    const msg = `Hi ${
      users[index]?.userName ? `@${users[index]?.userName}` : users[index]?.name
    } \n ${message}`;
    bot.sendPhoto(users[index]?.id, imageUrl, {
      caption: msg,
    });
  }

  const response = responseObject(true, false, {
    data: users,
    message: "fetched successfully",
  });
  return res.status(httpStatus.OK).json(response);
});

const userController = {
  login,
  getRanks,
  compltetTask,
  buyMiner,
  buyBooster,
  addClicks,
  dailyLogin,
  getTask,
  getNetworks,
  getRefralFrineds,
  getminingPowerUps,
  getDailyLoginRewards,
  getBoosters,
  changeNetwork,
  getRanksLeaderBoard,
  sendNotifiactionTelegram,
  getSecretCode,
  claimSecretReward,
  sendUpdateTelegram
};

export default userController;
