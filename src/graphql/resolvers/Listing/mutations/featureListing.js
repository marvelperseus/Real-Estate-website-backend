const Listing = require('../../../../models/Listing');

const featureListing = async (obj, args, context, info) => {
  const { uuids } = args;

  try {
    await Listing.updateMany({}, {featured: false});
    await Listing.updateMany({listingID: {$in: uuids}}, {featured: true});
  } catch (err) {
    logger.log('error', err);
    return false;
  }

  return true;
};

module.exports = featureListing;
