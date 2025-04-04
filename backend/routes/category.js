// const express = require("express");
// const { createCategory, getCategories } = require("../controller/category");

// const router = express.Router();
// router.post("/", createCategory);
// router.get("/", getCategories);

// module.exports = router;
const express = require("express");
const { 
  createCategory, 
  getCategories, 
  updateCategory,
  deleteCategory
} = require("../controller/category");

const router = express.Router();
router.post("/", createCategory);
router.get("/", getCategories);
router.put("/:id", updateCategory); // Route pour modifier
router.delete("/:id", deleteCategory); // Route pour supprimer


module.exports = router;