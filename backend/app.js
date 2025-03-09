const express = require("express");
const ErrorHandler = require("./utils/ErrorHandler.js");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "./backend/config/.env" });
}

// Import routes
const categoryRoutes = require("./routes/category");
const subCategoryRoutes = require("./routes/subcategory");
const productRoutes = require("./routes/product");
const sizeRoutes = require("./routes/size");
const user=require("./controller/user");


app.use("/api/v2/user", user);
app.use("/api/v2/categories", categoryRoutes);//  Ajout des routes cat
app.use("/api/v2/subcategories", subCategoryRoutes);//  Ajout des routes subcat
app.use("/api/v2/products", productRoutes)//  Ajout des routes produits
app.use("/api/v2/sizes", sizeRoutes);

// Gestion des erreurs
const errorMiddleware = require("./middleware/Error");

app.use(errorMiddleware)

module.exports = app;
