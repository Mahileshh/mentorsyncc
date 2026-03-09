const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const mentor = require("../controllers/mentorController");

router.post("/approve-leave", auth, role(["mentor"]), mentor.approveLeave);
router.post("/verify-placement", auth, role(["mentor"]), mentor.verifyPlacement);
router.get("/mentorstudents", auth, role(["mentor"]), mentor.getMyStudents);
router.get("/leaves", auth, role(["mentor"]), mentor.getMyLeaves);
router.get("/placements", auth, role(["mentor"]), mentor.getMyPlacements);
router.patch("/placements/:id", auth, role(["mentor"]), mentor.updatePlacement);

router.get("/students/:studentId/rewards", auth, role(["mentor"]), mentor.getStudentRewards);
router.get("/students/:studentId/leaves", auth, role(["mentor"]), mentor.getStudentLeaves);
router.get("/students/:studentId/placements", auth, role(["mentor"]), mentor.getStudentPlacements);
router.get("/students/:studentId/academics", auth, role(["mentor"]), mentor.getStudentAcademics);

module.exports = router;
