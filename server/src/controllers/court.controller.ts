import type { Request, Response } from "express";
import court from "../models/court.js";

export const createCourt = async (req: Request, res: Response) => {
   try {
      const { name, pricePerHour, description } = req.body;
      const newCourt = new court({ name, pricePerHour, description });
      await newCourt.save();

      res.status(201).json({ message: "The court was set up successfully!", data: newCourt });
   } catch (error) {
      res.status(500).json({ message: "Error while creating court: ", error });
   }
};

export const getCourts = async (req: Request, res: Response) => {
   try {
      const courts = await court.find();
      res.status(200).json(courts);
   } catch (error) {
      res.status(500).json({ message: "Error retrieving the court list: ", error });
   }
};
