const router = require("express").Router();
const upload = require("../middleware/upload.middleware");
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/user.controller");

router.get("/profile", auth, controller.getProfile);
router.put(
  "/weekly-goal",
  auth,
  controller.updateWeeklyGoal
);

router.put(
  "/profile",
  auth,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "cover_letter", maxCount: 1 }
  ]),
  
  controller.updateProfile
);

module.exports = router;
