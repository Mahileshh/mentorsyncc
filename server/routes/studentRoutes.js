const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const student = require("../controllers/studentController");

router.post("/apply-leave",      auth, role(["student"]), student.applyLeave);
router.post("/submit-placement", auth, role(["student"]), student.submitPlacement);
router.post("/apply-exemption",  auth, role(["student"]), student.applyExemption);

router.get("/my-leaves",     auth, role(["student"]), student.getMyLeaves);
router.get("/my-rewards",    auth, role(["student"]), student.getMyRewards);
router.get("/my-placements", auth, role(["student"]), student.getMyPlacements);
router.get("/my-exemptions", auth, role(["student"]), student.getMyExemptions);
router.get("/profile", auth, role(["student"]), student.getProfile);

module.exports = router;
