const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const admin = require("../controllers/adminController");

router.post("/add-student", auth, role(["admin"]), admin.addStudent);
router.post("/assign-student", auth, role(["admin"]), admin.assignStudent);
router.post("/add-reward-points", auth, role(["admin"]), admin.addRewardPoints);
router.post("/final-verify-placement", auth, role(["admin"]), admin.finalVerifyPlacement);

module.exports = router;
