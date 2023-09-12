import express from "express"   
import auth from "../middlewear/auth.js"
const router=express.Router()
import {createTour,deleteTour,getTour,getTourByUser,getTours, updateTour,searchTourBySearch, likeTour, getRelatedTours} from "../controllers/tour.js"

router.get("/search",searchTourBySearch)
router.get("/", getTours)
router.get("/:id", getTour)
router.post("/relatedTours", getRelatedTours);

router.post("/", auth, createTour)
router.delete("/:id",auth,deleteTour)
router.patch("/:id",auth,updateTour)
router.get("/userTours/:id",auth, getTourByUser  )
router.patch("/like/:id", auth, likeTour);

 


export default router;