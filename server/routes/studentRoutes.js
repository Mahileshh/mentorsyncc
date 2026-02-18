const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const student = require("../controllers/studentController");

router.post("/apply-leave", auth, role(["student"]), student.applyLeave);
router.post("/submit-placement", auth, role(["student"]), student.submitPlacement);

module.exports = router;
