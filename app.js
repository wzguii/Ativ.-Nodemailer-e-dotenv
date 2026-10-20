require("dotenv").config();
 
const express = require("express");
const path = require("path");
const router = require("./app/routes/router");
 
const app = express();
 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "app/views"));
 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
 
app.use(express.static(path.join(__dirname, "app/public")));
 
app.use("/", router);
 
const PORT = process.env.PORT || 3000;
 
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
 