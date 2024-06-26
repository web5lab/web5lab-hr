import express from "express";
import userController from "../controller/user.controller.js";
import { verifyTgUser } from "../utils/verifyLogin.js";
const router = express.Router();

router.get("/networks",userController.getNetworks);
router.get("/miningcards",userController.getminingPowerUps);
router.get("/booster",userController.getBoosters);
router.get("/task",userController.getTask);
router.get("/rank",userController.getRanks);
router.get("/dailyReward",userController.getDailyLoginRewards);
router.post("/reffrals",verifyTgUser,userController.getRefralFrineds);

router.post("/login",verifyTgUser,userController.login);
router.post("/clicks",verifyTgUser,userController.addClicks)
router.post("/changeNetwork",verifyTgUser,userController.changeNetwork)

export default router;
