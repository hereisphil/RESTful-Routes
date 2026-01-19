import express from "express";
const router = express.Router();

import contactsRoutes from "./contactsRoutes.js";

router.get("/", (req, res) => {
    res.status(200).json({
        message: `${req.method} - Request made to /api/v1`,
        success: true,
    });
});

router.use("/contacts", contactsRoutes);

export default router;
