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

// Example usage:
const miningRate = 10; // Assuming 10 units per hour
const lastMiningTimestamp = 1715474204003; // Replace with your last mining timestamp

// Calculate mining amount since last mining
const result = calculateMiningAmount(miningRate, lastMiningTimestamp);
console.log(result);
