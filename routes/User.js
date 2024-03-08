const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authenticateOTPTokens");

const {createUser} = require("../controllers/User/createUser");
router.post("/createUser",authMiddleware.authenticateOTPTokens, createUser);

const {updateUser} = require("../controllers/User/updateUser");
router.put("/updateUser",authMiddleware.authenticateOTPTokens, updateUser); 

const {checkUserUnique} = require("../controllers/User/checkUserUnique");
router.get("/checkUserUnique", checkUserUnique);

const {getListOfUser} = require("../controllers/User/getListOfUser");
router.get("/getListOfUser", getListOfUser);

const {getUserByUserId} = require("../controllers/User/getUserByUserId");
router.get("/getUserByUserId/:userId", getUserByUserId);

const {updateUserByUserId} =require("../controllers/User/updateUserByUserId");
router.post("/updateUserByUserId",updateUserByUserId);

const {toggleaActivateUserByUserId} =require("../controllers/User/toggleaActivateUserByUserId");
router.post("/toggleaActivateUserByUserId",toggleaActivateUserByUserId);

const {checkValidUser} = require("../controllers/User/checkValidUser");
router.get("/checkValidUser",checkValidUser);

const {getUserByUserName} = require("../controllers/User/getUserByUserName");
router.get("/getUserByUserName/:userName",authMiddleware.authenticateOTPTokens,getUserByUserName);



module.exports=router
