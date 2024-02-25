import Listing from "../models/listing.model.js"
import { handleError } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(200).json(listing);
  } catch (error) {
    next(error)
  }
}

export const deleteListing = async (req, res, next) => {
  const listings = await Listing.findById(req.params.id);
  if (!listings) {
    return next(handleError(404, "Listing not found"))
  }

  if (req.user.id !== listings.userRef) {
    return next(handleError(401, "You can only delete your own listing"))
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing have been deleted!")
  } catch (error) {
    next(error)
  }
}

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(handleError(404, "Listing not found"))
  }

  if (req.user.id !== listing.userRef) {
    return next(handleError(401, "You can only update own listing"))
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error)
  }
}
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(handleError(404, "Listing not found"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error)
  }
}

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = req.query.searchTerm || '';
    let offer = req.query.offer;
    if (offer === undefined || 'false') {
      offer = { $in: [false, true] }
    }

    let parking = req.query.parking;
    if (parking === undefined || 'false') {
      parking = { $in: [false, true] }
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] }
    }

    let type = req.query.type;
    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] }
    }

    const sort = req.query.sort || 'createAt';
    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      parking,
      furnished,
      type
    }).sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex)

    res.status(200).json(listings);

  } catch (error) {
    next(error)
  }
}