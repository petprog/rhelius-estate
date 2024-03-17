import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    const result = await Listing.create(req.body);
    const listing = result._doc;
    return res.status(201).send({ ...listing, success: true });
  } catch (err) {
    next(err);
  }
};
