import { catchAsync, httpStatus, responseObject } from "../utils/helper.js";
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
const token = "6737211963:AAGjUss03Wdev4fIryoUFuqR8lX5AOaeQpA";
const bot = new TelegramBot(token);

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
  const user = await userSchema.findOne({ id: id });
  if (!user) {
    const newUser = new userSchema();
    newUser.id = id;
    newUser.userName = username;
    newUser.name = first_name + last_name;
    newUser.referalId = id;
    newUser.lastLoginTime = Date.now();
    if (chatType === "private") {
      newUser.instanaceId = instance;
      bot.sendMessage(instance, "hi your account is created");
    }
    if (is_premium) {
      newUser.isPremium = is_premium;
    }
    if (reffralId) {
      newUser.referedBy = reffralId;
      if (is_premium) {
        await userSchema.findOneAndUpdate(
          { id: reffralId },
          {
            $inc: { Balance: 10000, totalEarning: 10000 },
          }
        );
      } else {
        await userSchema.findOneAndUpdate(
          { id: reffralId },
          {
            $inc: { Balance: 5000, totalEarning: 5000 },
          }
        );
      }
    }
    await newUser.save();
  }

  const userDb = await userSchema.aggregate([
    {
      $match: { id: id },
    },
    {
      $lookup: {
        from: "networks", // Use the actual collection name for user details
        localField: "currentNetwork",
        foreignField: "id",
        as: "currentNetwork",
      },
    },
    {
      $lookup: {
        from: "ranks", // Use the actual collection name for user details
        localField: "currentRank",
        foreignField: "id",
        as: "currentRank",
      },
    },
    {
      $project: {
        _id: 0,
        __v: 0,
        instanaceId: 0,
        lastMiningTime: 0,
        lastLoginTime: 0,
        blocked: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    },
  ]);

  let notification = [];
  if (user.MiningRatePerHour != 0) {
    const miningData = calculateMiningAmount(
      user.MiningRatePerHour,
      user.lastMiningTime
    );
    user.lastMiningTime = miningData.lastMiningTime;
    user.Balance += miningData.miningAmount;
    user.totalEarning += miningData.miningAmount;
    const notificationData = {
      amount: miningData.miningAmount,
      type: "mining",
    };
    notification.push(notificationData);
  }

  if (user.dailyTask.day != 0) {
    if (
      calculateDaysSpent(user.dailyTask.timestamp) < 1 ||
      user.dailyTask.day === 10
    ) {
      user.dailyTask.day = 0;
      user.dailyTask.timestamp = 0;
    }
  }
  if (calculateDaysSpent(user.lastLoginTime) === 1) {
    user.powerUps.boost.remaining = 3;
    user.powerUps.refill.used = false;
  }

  if (calculateDaysSpent(user.ser.dailyTask.timestamp) != 0) {
    const notificationData = {
      amount: 0,
      type: "dailyreward",
    };
    notification.push(notificationData);
  }

  const rank = findCurrentRank(user.Balance);
  if (rank.id != user.currentRank) {
    user.currentRank = rank.id;
    if (user.referedBy != 0) {
      if (user.isPremium) {
        await userSchema.findOneAndUpdate(
          { id: user.referedBy },
          {
            $inc: {
              Balance: rank.premiumReferalAmount,
              totalEarning: rank.premiumReferalAmount,
            },
          }
        );
      } else {
        await userSchema.findOneAndUpdate(
          { id: user.referedBy },
          {
            $inc: { Balance: rank.RefralAmount , totalEarning: rank.RefralAmount},
          }
        );
      }
    }
  }

  user.lastLoginTime = Date.now();

  await user.save();

  const response = responseObject(true, false, {
    data: userDb[0],
    notification: notification,
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
  const task = await taskSchema.findOne({ id: id });
  if (!task) {
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
  await user.save();
  const successResponse = responseObject(true, false, {
    message: "Task completed successfully",
  });
  return res.status(httpStatus.OK).json(successResponse);
});

const buyMiner = catchAsync(async (req, res) => {
  const { id } = req.userPayload;
  const { minerId } = req.body;

  if (!id || !minerId) {
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
  console.log(user.miningCards);
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

  if (nextLevel != 1) {
    const previousLevelDetails = powerUp.levelAmount.find(
      (l) => l.level === nextLevel - 1
    );
    const hashtoAdd = levelDetails.miningRate - previousLevelDetails.miningRate;
    user.MiningRatePerHour += hashtoAdd;
  }

  if (nextLevel === 1) {
    user.MiningRatePerHour + levelDetails.miningRate;
  }

  // Deduct the price from user's balance and update power-up level
  user.Balance -= buyingPrice;
  userPowerUp.level = nextLevel;

  const existingMinerIndex = user.miningCards.findIndex(
    (b) => b.id === minerId
  );
  if (existingMinerIndex !== -1) {
    user.miningCards[existingMinerIndex] = userPowerUp;
  } else {
    user.miningCards.push(userPowerUp);
  }

  await user.save();

  const successResponse = responseObject(true, false, {
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

  if (boosterId === 1) {
    user.earnPerclicks += levelDetails.buffIncrement;
  }
  if (boosterId === 2) {
    user.rechargeLimit += levelDetails.buffIncrement;
  }
  if (boosterId === 3) {
    user.rechargeRate += levelDetails.buffIncrement;
  }

  await user.save();

  const successResponse = responseObject(true, false, {
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
  console.log("mining time", user.lastMiningTime);
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

  if (calculateDaysSpent(user.dailyTask.timestamp) === 0) {
    const err = responseObject(false, true, {
      message: "please wait 24 hour",
    });
    return res.status(httpStatus.BAD_REQUEST).json(err);
  }
  if (user.dailyTask.day === 10) {
    user.dailyTask.day = 0;
  }

  const rewardData = await dailyRewardSchema.findOne({
    day: user.dailyTask.day + 1,
  });

  if (!rewardData) {
    const err = responseObject(false, true, {
      message: "reward not found",
    });
    return res.status(httpStatus.NOT_FOUND).json(err);
  }

  user.dailyTask.day += 1;
  user.dailyTask.timestamp = Date.now();
  user.Balance += rewardData.rewardAmount;
  user.totalEarning += rewardData.rewardAmoun;
  await user.save();
  const response = responseObject(true, false, {
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
};

export default userController;
