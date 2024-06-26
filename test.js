function startMining(miningRate) {
  let points = 0;

  // Calculate the interval in milliseconds
  let interval = 1000; // Default to 1 second

  // Calculate points to add per interval
  let pointsPerInterval = 1; // Default to 1 point per interval

  if (miningRate > 3600) {
    pointsPerInterval = Math.floor(miningRate / 3600);
  } else if (miningRate < 3600) {
    interval = Math.floor((3600 / miningRate) * 1000);
    console.log("interval", interval);
  }

  // Update points at each interval
  setInterval(() => {
    points += pointsPerInterval;
    console.log(`Points: ${points}`);
  }, interval);
}

function difrenceCalculator(miningRate) {
  let points = 0;

  let pointsPerInterval = 1; 
  pointsPerInterval = miningRate / 3600;
  for (let i = 0; i < 3600; i++) {
    points += pointsPerInterval;
  }
  console.log("diffrence is", miningRate, Math.floor(points));
}

function calculatePointsSinceLastClaim(miningRate, lastClaimTime) {
  let currentTime = new Date();
  let timeDifference = (currentTime - lastClaimTime) / 1000; // Time difference in seconds

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
}

// Example usage
// startMining(3600); // Updates 1 point every second
// startMining(1800); // Updates 1 point every 2 seconds
// difrenceCalculator(45466756);
let lastClaimTime = new Date();
lastClaimTime.setHours(lastClaimTime.getHours() - 24);
let pointsSinceLastClaim = calculatePointsSinceLastClaim(2, lastClaimTime);
console.log(`Points since last claim: ${pointsSinceLastClaim}`);
// startMining(89700.65);
