const rankData = [
  {
    id: 1,
    title: "Rank 1",
    imageUrl: "ranks/rank1.png",
    requiredAmount: 0,
    RefralAmount: 5000,
    premiumReferalAmount: 10000,
  },
  {
    id: 2,
    title: "Rank 2",
    imageUrl: "ranks/rank2.png",
    requiredAmount: 80000,
    RefralAmount: 15000,
    premiumReferalAmount: 30000,
  },
  {
    id: 3,
    title: "Rank 3",
    imageUrl: "ranks/rank3.png",
    requiredAmount: 200000,
    RefralAmount: 25000,
    premiumReferalAmount: 50000,
  },
  {
    id: 4,
    title: "Rank 4",
    imageUrl: "ranks/rank4.png",
    requiredAmount: 2000000,
    RefralAmount: 50000,
    premiumReferalAmount: 100000,
  },
  {
    id: 5,
    title: "Rank 5",
    imageUrl: "ranks/rank5.png",
    requiredAmount: 10000000,
    RefralAmount: 100000,
    premiumReferalAmount: 200000,
  },
  {
    id: 6,
    title: "Rank 6",
    imageUrl: "ranks/rank6.png",
    requiredAmount: 50000000,
    RefralAmount: 250000,
    premiumReferalAmount: 500000,
  },
  {
    id: 7,
    title: "Rank 7",
    imageUrl: "ranks/rank7.png",
    requiredAmount: 250000000,
    RefralAmount: 500000,
    premiumReferalAmount: 1000000,
  },
  {
    id: 8,
    title: "Rank 8",
    imageUrl: "ranks/rank8.png",
    requiredAmount: 500000000,
    RefralAmount: 1000000,
    premiumReferalAmount: 2000000,
  },
  {
    id: 9,
    title: "Rank 9",
    imageUrl: "ranks/rank9.png",
    requiredAmount: 1000000000,
    RefralAmount: 2500000,
    premiumReferalAmount: 5000000,
  },
];

export const findCurrentRank = (currentBalance) => {
  let currentRank = null;

  if (currentBalance < 0) {
    currentBalance = 0;
  }

  for (let i = rankData.length - 1; i >= 0; i--) {
    if (currentBalance >= rankData[i].requiredAmount) {
      currentRank = rankData[i];
      break;
    }
  }

  return currentRank;
};

console.log(findCurrentRank(-1000000000000000000));
