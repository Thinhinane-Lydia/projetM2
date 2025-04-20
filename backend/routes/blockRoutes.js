const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const { 
  blockUser, 
  unblockUser, 
  getBlockedUsers,
  isUserBlocked,
  checkIfUserIsBlockedBy
} = require("../controller/blockController");

const router = express.Router();

// Routes pour le blocage d'utilisateurs
router.post("/block/:userId", isAuthenticated, blockUser);
router.post("/unblock/:userId", isAuthenticated, unblockUser);
router.get("/blocked", isAuthenticated, getBlockedUsers);
router.get("/is-blocked/:userId", isAuthenticated, isUserBlocked);
router.get('/blocked-by/:userId', isAuthenticated,checkIfUserIsBlockedBy);
module.exports = router;
