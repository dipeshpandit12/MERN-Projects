const { Router } = require("express");
const userRoutes = require("./input_auth");
const todoRoutes=require("./todo");

const router = Router();

router.use("/api/auth",userRoutes);
router.use("/api/todos",todoRoutes);
module.exports = router;
