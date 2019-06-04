const moment = require('moment');
const cleanUserInput = require('../../../../utils/cleanUserInput');
const { agent: agentRole } = require('../../../../constants/userTypes');
const generateRandomID = require('../../../../utils/idGenerator');
const Listing = require('../../../../models/Listing');
const throwUnautorizedAccessError = require('../../../../utils/throwUnauthorizedError');
const { logger } = require('../../../../utils/logger');
const FormSelectItem = require('../../../../models/FormSelectItem');
const { sendOne } = require('../../../../services/nodemailer');
const { capitalize } = require('../../../../utils/stringUtils');
const { round } = require('../../../../utils/Math');
const { address, websiteURL } = require('../../../../constants/companyInfo');

const createListing = async (obj, args, context, info) => {
  const { currentUser, res, req } = context;

  const returnObj = {
    listing: null,
    userErrors: [],
    otherError: null,
  };

  if (!currentUser || currentUser.role !== agentRole) {
    throwUnautorizedAccessError(req, info);
  }

  const {
    address,
    offer,
    region,
    borough,
    neighborhood,
    price,
    description,
    images,
    category,
    ownership,
    type,
    petPolicy,
    floors,
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

  let listingID = generateRandomID();

  console.log('args', args);

  if (args.input.listingID) {
    listingID = args.input.listingID;
  }

  const listingToSubmit = {
    listingID: listingID,
    agentID: currentUser.uuid,
    agentName: currentUser.fullName,
    address,
    offer,
    region,
    borough,
    neighborhood,
    price,
    description,
    images,
    category,
    ownership,
    type,
    petPolicy,
    floors,
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
  };

  listingToSubmit.images = listingToSubmit.images.map(
    fileName =>
      `https://${
        process.env.AWS_S3_BUCKET_NAME
      }.s3.amazonaws.com/images/${listingID}/${fileName}`
  );

  let listing;

  const newListing = new Listing(listingToSubmit);

  try {
    listing = await newListing.save(listingToSubmit);
    returnObj.listing = listing;
  } catch (err) {
    console.log('Not Saved', err);
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

module.exports = createListing;
