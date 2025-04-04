// const express = require("express");
// const { createComment, getCommentsByProduct, deleteComment } = require("../controller/commentController");
// const { isAuthenticated } = require("../middleware/auth");

// const router = express.Router();

// router.post("/create", isAuthenticated, createComment);
// router.get("/:productId", getCommentsByProduct);
// router.delete("/:id", isAuthenticated, deleteComment);

// module.exports = router;
const express = require("express");
const { createComment, getCommentsByProduct, deleteComment } = require("../controller/commentController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.post("/create", isAuthenticated, createComment);
router.get("/:productId", getCommentsByProduct);
router.delete("/:id", isAuthenticated, deleteComment);

module.exports = router;