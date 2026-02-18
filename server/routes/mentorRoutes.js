const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const mentor = require("../controllers/mentorController");

router.post("/approve-leave", auth, role(["mentor"]), mentor.approveLeave);
router.post("/verify-placement", auth, role(["mentor"]), mentor.verifyPlacement);

module.exports = router;
