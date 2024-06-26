import { catchAsync, httpStatus, responseObject } from "../utils/helper.js";
import networkSchema from "../database/schema/network.schema.js";
import powerUpsSchema from "../database/schema/powerUps.schema.js";
import taskSchema from "../database/schema/task.Schema.js";
import rankSchema from "../database/schema/ranks.schema.js";
import userSchema from "../database/schema/user.Schema.js";
import dailyRewardSchema from "../database/schema/dailyReward.Schema.js";
import boosterSchema from "../database/schema/booster.Schema.js";

const login = catchAsync(async (req, res) => {
  const {
    id,
    first_name,
    allows_write_to_pm,
    last_name,
    username,
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
    await newUser.save();
    if (reffralId) {
    }

    console.log("user", newUser);
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
  console.log("userFound", userDb);

  const response = responseObject(true, false, {
    data: userDb[0],
    notification: [
      {
        amount: 1000,
        type: "reffral",
        message: "you have earned 1000 coins for reffral",
      },
    ],
    message: "fetched successfully",
  });
  return res.status(httpStatus.OK).json(response);
});

const compltetTask = catchAsync(async (req, res) => {});

const buyMiner = catchAsync(async (req, res) => {});

const buyBooster = catchAsync(async () => {});

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

const dailyLogin = catchAsync(async () => {});
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
      $project: {
        _id: 0,
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
      },
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
        from: "users", // Make sure the collection name matches your actual user collection name
        localField: "referalId",
        foreignField: "referedBy",
        as: "referrals",
      },
    },
    {
      $lookup: {
        from: "users", // Make sure the collection name matches your actual user collection name
        localField: "referedBy",
        foreignField: "id",
        as: "referredByDetails",
      },
    },
    {
      $project: {
      _id: 0,
        friends: {
          $concatArrays: [
            {
              $map: {
                input: "$referredByDetails",
                as: "referredByDetail",
                in: {
                  name: "$$referredByDetail.name",
                  Balance: "$$referredByDetail.Balance",
                  rank:"$$referredByDetail.currentRank"
                },
              },
            },
            {
              $map: {
                input: "$referrals",
                as: "referral",
                in: {
                  name: "$$referral.name",
                  Balance: "$$referral.Balance",
                  rank:"$$referral.currentRank"
                },
              },
            },
          ],
        },
      },
    },
  ]);

  const response = responseObject(true, false, {
    data: friends[0]?.friends,
    message: "friends",
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
