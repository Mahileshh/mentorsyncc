const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const student = require("../controllers/studentController");

router.post("/apply-leave", auth, role(["student"]), student.applyLeave);
router.post("/submit-placement", auth, role(["student"]), student.submitPlacement);
router.get("/my-placements", auth, role(["student"]), student.getMyPlacements);
router.get("/profile", auth, role(["student"]), student.getProfile);

module.exports = router;
