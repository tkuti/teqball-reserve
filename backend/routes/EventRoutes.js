const express = require("express");
const router = express.Router();
const EventController = require("../controllers/EventController");
const verifyToken = require('../verifyToken')



router.get("/:groupId", verifyToken, EventController.getEventsByGroupId);

router.get("/byId/:googleId", verifyToken, EventController.getEventsByGoogleId);

router.post("/insert", verifyToken, EventController.insertEvent);

router.post("/update-participation", verifyToken, EventController.updateParticipation);





module.exports = router;