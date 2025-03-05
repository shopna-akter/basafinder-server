import express from "express";
import { verifyToken, authorizeRoles } from "../../middlewares/auth.middleware";
import {
  createRentalRequest,
  getRentalRequests,
  updateRentalRequest,
  deleteRentalRequest,
} from "./rentalRequest.controller";
import { UserRole } from "../user/user.types";

const router = express.Router();

// Tenant can request a rental
router.post("/", verifyToken, authorizeRoles(UserRole.TENANT), createRentalRequest);

// Landlord can view all requests
router.get("/", verifyToken, authorizeRoles(UserRole.LANDLORD), getRentalRequests);

// Landlord can approve/reject requests
router.put("/:id", verifyToken, authorizeRoles(UserRole.LANDLORD), updateRentalRequest);

// Tenant can cancel their request
router.delete("/:id", verifyToken, authorizeRoles(UserRole.TENANT), deleteRentalRequest);

export default router;
