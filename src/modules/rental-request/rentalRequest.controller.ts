import { Request, Response } from "express";
import RentalRequest from "./rentalRequest.model";
import Rental from "../rental/rental.model";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// Create a rental request (Tenant Only)
export const createRentalRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "tenant") {
      return res.status(403).json({ message: "Only tenants can request rentals" });
    }

    const rental = await Rental.findById(req.body.rental);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    const rentalRequest = await RentalRequest.create({
      tenant: req.user.id,
      rental: req.body.rental,
      status: "pending",
    });

    res.status(201).json(rentalRequest);
  } catch (error) {
    res.status(500).json({ message: "Error creating rental request", error });
  }
};

// Get all rental requests (Landlord Only)
export const getRentalRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "landlord") {
      return res.status(403).json({ message: "Only landlords can view requests" });
    }

    const requests = await RentalRequest.find()
      .populate("tenant", "name email")
      .populate("rental", "title");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rental requests", error });
  }
};

// Approve or Reject a Rental Request (Landlord Only)
export const updateRentalRequest = async (req: AuthRequest, res: Response) => {
  try {
    const rentalRequest = await RentalRequest.findById(req.params.id).populate("rental");
    if (!rentalRequest) return res.status(404).json({ message: "Rental request not found" });

    if (rentalRequest.rental.landlord.toString() !== req.user?.id) {
      return res.status(403).json({ message: "You can only manage requests for your own rentals" });
    }

    rentalRequest.status = req.body.status; // "approved" or "rejected"
    await rentalRequest.save();

    res.status(200).json(rentalRequest);
  } catch (error) {
    res.status(500).json({ message: "Error updating rental request", error });
  }
};

// Delete rental request (Tenant Only)
export const deleteRentalRequest = async (req: AuthRequest, res: Response) => {
  try {
    const rentalRequest = await RentalRequest.findById(req.params.id);
    if (!rentalRequest) return res.status(404).json({ message: "Rental request not found" });

    if (rentalRequest.tenant.toString() !== req.user?.id) {
      return res.status(403).json({ message: "You can only delete your own requests" });
    }

    await rentalRequest.deleteOne();
    res.status(200).json({ message: "Rental request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting rental request", error });
  }
};
