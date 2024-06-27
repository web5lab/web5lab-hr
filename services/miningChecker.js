export const calculateMiningAmount = (miningRatePerHour, lastMiningTime) => {
  const currentTime = Date.now();
  const timeElapsed = currentTime - lastMiningTime;
  let hoursElapsed = timeElapsed / (1000 * 60 * 60);
  if (hoursElapsed > 8) {
    hoursElapsed = 8;
  }
  const miningAmount = hoursElapsed * miningRatePerHour;
  return {
    miningAmount: Math.floor(miningAmount),
    lastMiningTime: currentTime,
  };
};

