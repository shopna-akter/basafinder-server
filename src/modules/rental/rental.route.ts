import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware";
import {
  createRental,
  getRentals,
  getRentalById,
  updateRental,
  deleteRental,
} from "../controllers/rental.controller";
import { UserRole } from "../types/user.types";

const router = express.Router();

// Public Routes
router.get("/", getRentals);
router.get("/:id", getRentalById);

// Protected Routes (Landlord Only)
router.post("/", verifyToken, authorizeRoles(UserRole.LANDLORD), createRental);
router.put("/:id", verifyToken, authorizeRoles(UserRole.LANDLORD), updateRental);
router.delete("/:id", verifyToken, authorizeRoles(UserRole.LANDLORD), deleteRental);

export default router;
