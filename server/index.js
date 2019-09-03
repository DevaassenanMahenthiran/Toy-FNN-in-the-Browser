import path from "path";

import express from "express";
import cors from "cors";
import hbs from "express-handlebars";

import pages from "./routes/pages";

const app = express();

// static files
app.use('/static', express.static(path.join(__dirname, "..", "static")));

// middleware
app.use(express.json());
app.use(cors());

// hbs middleware
app.engine("hbs", hbs({ extname: "hbs" }));
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "hbs");

// router middleware
app.use("/", pages);

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});