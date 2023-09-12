import mongoose from "mongoose";
import TourModal from "../modals/tour.js"

export const createTour = async (req, res) => {
    const tour = req.body;
    const newTour = new TourModal({
        ...tour,
        creator: req.userId,
        createAt: new Date().toISOString,
    });
    try {
        await newTour.save();
        res.status(200).json(newTour)
    } catch (err) {
        res.status(404).json({ message: "Somthing went wrong" })
    }
}

export const getTours = async (req, res) => {
    try {
        const tour = await TourModal.find();
        res.status(200).json(tour)
    } catch (err) {
        res.status(404).json({ message: "Somthing went wrong" })
    }
}
export const getTour = async (req, res) => {
    const { id } = req.params;
    try {
        const tour = await TourModal.findById(id);
        res.status(200).json(tour)
    } catch (err) {
        res.status(404).json({ message: "Somthing went wrong" })
    }
}

export const getTourByUser = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "User dosen't exist" })
        }

        const userTours = await TourModal.find({ creator: id });
        res.status(200).json(userTours)
    } catch (err) {
        res.status(404).json({ message: "Somthing Wrong" })

    }
};
export const deleteTour = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: `No Tour exist with id-${id}` })
        }
        await TourModal.findByIdAndRemove(id)
        res.json({ message: "Tour delete successfully" })
    } catch (err) {
        res.status(404).json({ message: "Somthing Wrong" })
    }
}

export const updateTour = async (req, res) => {
    const { id } = req.params;
    const { title, description, creator, imageFile, tags } = req.body
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: `No Tour exist with id-${id}` })
        }
        const updatedTour = {
            creator,
            title,
            description,
            imageFile,
            tags,
            _id: id,
        }
        await TourModal.findByIdAndUpdate(id, updatedTour, { new: true })
        res.json(updatedTour)
    } catch (err) {
        res.status(404).json({ message: err })
    }
}

export const searchTourBySearch = async (req, res) => {
    const { searchQuery } = req.query;
    try {
        const title = new RegExp(searchQuery, "i");
        const tours = await TourModal.find({ title });
        res.json(tours);
    } catch (error) {
        res.status(404).json({ message: "Something went wrong" });
    }
}

export const getRelatedTours = async (req, res) => {
    const tags = req.body;
    try {
      const tours = await TourModal.find({ tags: { $in: tags } });
      res.json(tours);
    } catch (error) {
      res.status(404).json({ message: "Something went wrong" });
    }
  };
  
  export const likeTour = async (req, res) => {
    const { id } = req.params;
    try {
      if (!req.userId) {
        return res.json({ message: "User is not authenticated" });
      }
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: `No tour exist with id: ${id}` });
      }
  
      const tour = await TourModal.findById(id);
  
      const index = tour.likes.findIndex((id) => id === String(req.userId));
  
      if (index === -1) {
        tour.likes.push(req.userId);
      } else {
        tour.likes = tour.likes.filter((id) => id !== String(req.userId));
      }
  
      const updatedTour = await TourModal.findByIdAndUpdate(id, tour, {
        new: true,
      });
  
      res.status(200).json(updatedTour);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };