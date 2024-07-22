import express from "express";
import userController from "../controller/user.controller.js";
import { verifyTgUser } from "../utils/verifyLogin.js";
const router = express.Router();

router.get("/networks", userController.getNetworks);
router.get("/miningcards", userController.getminingPowerUps);
router.get("/booster", userController.getBoosters);
router.get("/task", userController.getTask);
router.get("/rank", userController.getRanks);
router.get("/dailyReward", userController.getDailyLoginRewards);
router.get("/secretCode", userController.getSecretCode);
router.get("/lederboard/:rank", userController.getRanksLeaderBoard);

router.post("/reffrals", verifyTgUser, userController.getRefralFrineds);
router.post("/login", verifyTgUser, userController.login);
router.post("/clicks", verifyTgUser, userController.addClicks);
router.post("/claimSecretReward", verifyTgUser, userController.claimSecretReward);
router.post("/changeNetwork", verifyTgUser, userController.changeNetwork);
router.post("/buybooster", verifyTgUser, userController.buyBooster);
router.post("/buyminer", verifyTgUser, userController.buyMiner);
router.post("/completetask", verifyTgUser, userController.compltetTask);
router.post("/dailylogin", verifyTgUser, userController.dailyLogin);
router.post("/notifyUser",  userController.sendNotifiactionTelegram);
router.post("/updateUser",  userController.sendUpdateTelegram);

export default router;
