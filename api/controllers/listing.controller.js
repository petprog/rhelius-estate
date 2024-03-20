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

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found!"));
    if (req.user.id !== listing.userRef.toString())
      return next(errorHandler(401, "You can only delete your listings"));
    await Listing.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .send({ message: "Listing has been deleted.", success: true });
  } catch (err) {
    next(err);
  }
};
