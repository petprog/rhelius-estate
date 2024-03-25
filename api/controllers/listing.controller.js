import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    const result = await Listing.create(req.body);
    const listing = result._doc;
    return res.status(201).send({
      message: "Listing has been created successfully.",
      success: true,
      data: listing,
    });
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

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found!"));
    if (req.user.id !== listing.userRef.toString())
      return next(errorHandler(401, "You can only update your listings"));
    const result = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    const updatedListing = result._doc;
    res.status(200).send({
      message: "Listing has been updated.",
      success: true,
      data: updatedListing,
    });
  } catch (err) {
    next(err);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const result = await Listing.findById(req.params.id);
    if (!result) return next(errorHandler(404, "Listing not found!"));
    const listing = result._doc;
    res.status(200).send({
      message: "Successfully get listing",
      success: true,
      data: listing,
    });
  } catch (err) {
    next(err);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    offer =
      offer === undefined || offer === "false" ? { $in: [false, true] } : offer;

    let furnished = req.query.furnished;
    furnished =
      furnished === undefined || furnished === "false"
        ? { $in: [false, true] }
        : furnished;

    let parking = req.query.parking;
    parking =
      parking === undefined || parking === "false"
        ? { $in: [false, true] }
        : parking;

    let type = req.query.type;
    type =
      type === undefined || type === "all" ? { $in: ["sale", "rent"] } : type;

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    res.status(200).send({
      message: "Successfully get listings",
      success: true,
      data: listings,
    });
  } catch (err) {
    next(err);
  }
};
