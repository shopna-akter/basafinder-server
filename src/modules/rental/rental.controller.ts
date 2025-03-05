import { Request, Response } from "express";
import Rental from "./rental.model";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// Create a rental (Landlord Only)
export const createRental = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "landlord") {
      return res.status(403).json({ message: "Only landlords can create rentals" });
    }

    const rental = await Rental.create({ ...req.body, landlord: req.user.id });
    res.status(201).json(rental);
  } catch (error) {
    res.status(500).json({ message: "Error creating rental", error });
  }
};

// Get all rentals
export const getRentals = async (req: Request, res: Response) => {
  try {
    const rentals = await Rental.find().populate("landlord", "name email");
    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rentals", error });
  }
};

// Get rental by ID
export const getRentalById = async (req: Request, res: Response) => {
  try {
    const rental = await Rental.findById(req.params.id).populate("landlord", "name email");
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    res.status(200).json(rental);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rental", error });
  }
};

// Update rental (Landlord Only)
export const updateRental = async (req: AuthRequest, res: Response) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    if (rental.landlord.toString() !== req.user?.id) {
      return res.status(403).json({ message: "You can only update your own listings" });
    }

    const updatedRental = await Rental.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedRental);
  } catch (error) {
    res.status(500).json({ message: "Error updating rental", error });
  }
};

// Delete rental (Landlord Only)
export const deleteRental = async (req: AuthRequest, res: Response) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    if (rental.landlord.toString() !== req.user?.id) {
      return res.status(403).json({ message: "You can only delete your own listings" });
    }

    await rental.deleteOne();
    res.status(200).json({ message: "Rental deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting rental", error });
  }
};
