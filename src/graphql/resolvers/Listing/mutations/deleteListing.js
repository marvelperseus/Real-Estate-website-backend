const {
  agent: agentRole,
  admin,
  superAdmin,
} = require('../../../../constants/userTypes');
const Listing = require('../../../../models/Listing');
const throwUnautorizedAccessError = require('../../../../utils/throwUnauthorizedError');
const { logger } = require('../../../../utils/logger');
const deleteUploadeds3Files = require('../../../../services/aws/s3/deleteFile');

const deleteListing = async (obj, args, context, info) => {
  const { currentUser, res, req } = context;

  const returnObj = {
    listingID: null,
    error: null,
  };

  if (!currentUser || currentUser.role !== agentRole) {
    throwUnautorizedAccessError(req, info);
  }

  const { uuid } = args;

  let listing;

  try {
    listing = await Listing.findByListingID(uuid);
    if (listing) returnObj.listingID = listing.listingID;
  } catch (err) {
    logger.log('error', err);
    returnObj.error = err;
    return returnObj;
  }

  if (!listing) {
    returnObj.error =
      'The listing that you are attempting to delete has already been deleted.';
    return returnObj;
  } else if (
    currentUser.role === agentRole &&
    listing.agentID !== currentUser.uuid
  ) {
    returnObj.error =
      'You must be the creator of the listing in order to update it.';
    return returnObj;
  }

  const { images } = listing;
  if (images.length) {
    const imageFileNames = images.map(url => url.split('/').pop());

    const imagePaths = imageFileNames.map(
      fileName => `images/${listing.listingID}/${fileName}`
    );

    const response = await deleteUploadeds3Files(
      [...imagePaths].map(path => ({
        Key: path,
      }))
    );

    console.log(response);

    if (response.error) {
      console.log(response.error);
      returnObj.error =
        'There was an error deleting your uploaded files for this listing.';
      return returnObj;
    }
  }

  try {
    await Listing.deleteOne({ listingID: listing.listingID });
  } catch (err) {
    logger.log('error', err);
    returnObj.error = 'There was an error deleting the listing!';
    return returnObj;
  }

  return returnObj;
};

module.exports = deleteListing;
