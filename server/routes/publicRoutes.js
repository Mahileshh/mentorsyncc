const router = require("express").Router();
const publicCtrl = require("../controllers/publicController");

router.get("/rewardpoints", publicCtrl.getRewardPoints);
router.get("/leaverequests", publicCtrl.getLeaveRequests);
router.get("/placementrequests", publicCtrl.getPlacementRequests);

module.exports = router;
