import { catchAsync, httpStatus } from "../utils/helper";

const totalUsers = catchAsync(async (req, res) => {});

const addTask = catchAsync(async () => {
  const {} = req.body;
});

const changeBalance = catchAsync(async () => {
    const {userId, amount} = req.body;
});
const addNetworks = catchAsync(async () => {
  const { networkId, name, url } = req.body;
});

const adminController = {
    totalUsers,
    addTask,
    changeBalance,
    addNetworks,
};
export default adminController;
