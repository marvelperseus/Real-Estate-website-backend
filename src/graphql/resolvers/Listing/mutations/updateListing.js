const cleanUserInput = require('../../../../utils/cleanUserInput');
const { agent: agentRole } = require('../../../../constants/userTypes');
const Listing = require('../../../../models/Listing');
const throwUnautorizedAccessError = require('../../../../utils/throwUnauthorizedError');
const { logger } = require('../../../../utils/logger');
const FormSelectItem = require('../../../../models/FormSelectItem');
const deleteUploaded3Files = require('../../../../services/aws/s3/deleteFile');

const updateListing = async (obj, args, context, info) => {
  const { currentUser, res, req } = context;

  const returnObj = {
    listing: undefined,
    userErrors: [],
    otherError: null,
  };

  if (!currentUser || currentUser.role !== agentRole) {
    throwUnautorizedAccessError(req, info);
  }

  const {
    listingID,
    address,
    offer,
    price,
    description,
    images,
    category,
    ownership,
    type,
    petPolicy,
    floors,
    neighborhood,
    borough,
    unitCount,
    builtIn,
    approx,
    condoOwn,
    cooperativeOwn,
    amenities,
    coordinates,
    sqFootage,
    moveInDate,
    beds,
    baths,
  } = cleanUserInput(args.input);

  const listingToUpdate = {
    address,
    offer,
    price,
    description,
    category,
    ownership,
    type,
    petPolicy,
    floors,
    neighborhood,
    borough,
    unitCount,
    builtIn,
    approx,
    condoOwn,
    cooperativeOwn,
    amenities,
    updatedAt: new Date(),
    coordinates,
    sqFootage,
    moveInDate,
    beds,
    baths,
  };

  let listing;

  try {
    listing = await Listing.findByListingID(listingID);
  } catch (err) {
    logger.log('error', err);
    returnObj.otherError = err;
    return returnObj;
  }

  if (!listing) {
    returnObj.otherError =
      'The listing that you are attempting to update has already been deleted.';
    return returnObj;
  } else if (listing.agentID !== currentUser.uuid) {
    returnObj.otherError =
      'You must be the creator of the listing in order to update it.';
    return returnObj;
  }

  if (images.length) {
    listingToUpdate.images = images.map(
      fileName =>
        `https://${
          process.env.AWS_S3_BUCKET_NAME
        }.s3.amazonaws.com/images/${listingID}/${fileName}`
    );
  }
  const imageFileNames = listing.images.map(url => url.split('/').pop());

  const imagesPaths = imageFileNames.map(
    fileName => `images/${listing.listingID}/${fileName}`
  );

  if (imagesPaths.length) {
    let response;
    if (images.length) {
      response = await deleteUploaded3Files(
        [...imagesPaths].map(path => ({
          Key: path,
        }))
      );
    }

    console.log(response);

    if (response && response.error) {
      console.log(response.error);
      returnObj.error =
        'There was an error updating your uploaded files for this listing.';
      return returnObj;
    }
  }

  try {
    listing = await listing.set({ ...listingToUpdate }).save();
    console.log(listing);
    returnObj.listing = listing;
  } catch (err) {
    if (err.custom && err.type === 'Normal') {
      if (err.errors) {
        Object.keys(err.errors).forEach(key => {
          returnObj.userErrors.push({
            field: key,
            message: err.errors[key],
          });
        });
      } else {
        logger.log('error', err);
        returnObj.otherError = err;
      }
    }
    return returnObj;
  }
  return returnObj;
};

module.exports = updateListing;
