import logErrors from "./logErrors.js";

export const catchAsync = function (fn) {
  /**
   * @fn function which is wrapped by the catchAsync function to use the DRY method.
   * pass down the request, response, and the next arguments into the inner function.
   */

  return async (req, res, next) => {
    try {
      const result = await fn(req, res, next);
      // Check if the result is a promise before proceeding
      if (result && typeof result.catch === "function") {
        await result; // Ensure any potential promise is resolved
      }
    } catch (err) {
      logErrors(err);
      console.log(err);
      return res.status(500).json("error occurred in server");
    }
  };
};
export const catchAsyncFn = function (fn) {
  /**
   * @fn function which is wrapped by the catchAsync function to use the DRY method.
   * pass down the request, response, and the next arguments into the inner function.
   */

  return async (req, res, next) => {
    try {
      const result = await fn(req, res, next);
      // Check if the result is a promise before proceeding
      if (result && typeof result.catch === "function") {
        await result; // Ensure any potential promise is resolved
      }
    } catch (err) {
      logErrors(err);
      console.log(err);
      return 
    }
  };
};

export const httpStatus = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  PARTIAL_CONTENT: 206,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INVALID_INPUT: 422,
  NOT_ACCEPTABLE: 406,
  INTERNAL_SERVER: 500,
  UNAUTHORIZATION: 401,
};

export const formatNumber = (num) => {
  const suffixes = ["", "k", "m", "b", "t"];
  const suffixIndex = Math.floor(Math.log10(Math.abs(num)) / 3);
  const suffix = suffixes[suffixIndex];

  const shortValue = num / Math.pow(10, suffixIndex * 3);

  const formattedValue = Number.isInteger(shortValue)
    ? shortValue.toFixed(0)
    : shortValue.toFixed(2);

  if (suffix === undefined) {
    return parseFloat(num);
  } else {
    return formattedValue + suffix;
  }
};

export const responseObject = function (success, error, options) {
  return { success, error, ...options };
};

export const calculateMinerRewardSinceLastClaim = (
  miningRate,
  lastClaimTime
) => {
  let currentTime = new Date();
  let timeDifference = (currentTime - lastClaimTime) / 1000; 
  let points = 0;
  let pointsPerInterval = 1;
  pointsPerInterval = miningRate / 3600;
  for (let i = 0; i < timeDifference; i++) {
    points += pointsPerInterval;
  }
  return {
    points: points,
    currentTime: currentTime,
  };
};
