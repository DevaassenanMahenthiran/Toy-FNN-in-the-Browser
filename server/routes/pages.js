import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", { title: "Neural Network solves XOr", layout: false });
});

export default router;