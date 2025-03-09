const express = require("express");
const { createSize, getSizes } = require("../controller/sizeController");
const { getSizesBySubCategory } = require("../controller/sizeController");

const router = express.Router();
router.post("/", createSize);
router.get("/", getSizes);
router.get("/subcategory/:subCategoryId", getSizesBySubCategory);

module.exports = router;
