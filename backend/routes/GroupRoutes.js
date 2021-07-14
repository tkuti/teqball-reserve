const express = require("express");
const router = express.Router();
const GroupController = require("../controllers/GroupController");
const verifyToken = require('../verifyToken')



//router.get("/", GroupController.getGroups);

router.post("/", verifyToken, GroupController.insertGroup);

router.post("/quit", verifyToken, GroupController.quitGroup);

router.post("/mygroups", verifyToken, GroupController.getMyGroups);

router.post("/othergroups", verifyToken, GroupController.getOtherGroups);

router.post("/insert-member", verifyToken, GroupController.insertMember);

router.post("/update-member", verifyToken, GroupController.updateMemberRole);





module.exports = router;