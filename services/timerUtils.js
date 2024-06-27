export const calculateDaysSpent = (lastCheckTime) => {
  const currentTime = new Date();
  const lastCheck = new Date(lastCheckTime);
  // Set the threshold time (6:30 AM)
  const thresholdHour = 4;
  const thresholdMinute = 31;
  const lastCheckThreshold = new Date(
    lastCheck.getFullYear(),
    lastCheck.getMonth(),
    lastCheck.getDate(),
    thresholdHour,
    thresholdMinute,
    0
  );
  // Adjust last check time if it's before 6:30 AM
  if (lastCheck < lastCheckThreshold) {
    lastCheckThreshold.setDate(lastCheckThreshold.getDate() - 1);
  }
  // Create a date object for the threshold time on the current day
  const currentThreshold = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate(),
    thresholdHour,
    thresholdMinute,
    0
  );
  if (currentTime < currentThreshold) {
    currentThreshold.setDate(currentThreshold.getDate() - 1);
  }
  const daysSpent = Math.floor(
    (currentThreshold - lastCheckThreshold) / (1000 * 60 * 60 * 24)
  );
  return daysSpent;
};


