import express from "express";
import { getAllUsers, getUserProfile } from "./user.controller";
import { verifyToken, authorizeRoles } from "../../middlewares/auth.middleware";
import { UserRole } from "./user.types";

const router = express.Router();

router.get("/profile", verifyToken, getUserProfile);

router.get("/all-users", verifyToken, authorizeRoles(UserRole.ADMIN), getAllUsers);

export default router;
