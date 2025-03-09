const express = require("express");
const { createProduct, getProducts } = require("../controller/product");

const router = express.Router();
router.post("/", createProduct);
router.get("/", getProducts);

module.exports = router;
