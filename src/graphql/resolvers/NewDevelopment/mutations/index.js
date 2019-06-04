const generateRandomID = require('../../../../utils/idGenerator');
const NewDevelopment = require('../../../../models/NewDevelopment');

const linkImage = (fileName, listingID) =>
  `https://${
    process.env.AWS_S3_BUCKET_NAME
  }.s3.amazonaws.com/images/${listingID}/${fileName}`;

const createNewDevelopment = async (obj, args, context, info) => {
  const { currentUser, res, req } = context;

  const returnObj = {
    newdevelopment: null,
    userErrors: [],
    otherError: null,
  };

  const newdevelopmentToSubmit = {
    ...args.input,
  };
  if (args.input.image) {
    newdevelopmentToSubmit.image = linkImage(
      args.input.image,
      args.input.newdevelopmentID
    );
  }
  if (args.input.builderimage) {
    newdevelopmentToSubmit.builderimage = linkImage(
      args.input.builderimage,
      args.input.newdevelopmentID
    );
  }
  if (args.input.builderlogos && args.input.builderlogos.length) {
    newdevelopmentToSubmit.builderlogos = args.input.builderlogos.map(
      filename => linkImage(filename, args.input.newdevelopmentID)
    );
  }

  let newdevelopment;

  try {
    newdevelopment = await NewDevelopment.findOneAndUpdate(
      { newdevelopmentID: args.input.newdevelopmentID },
      newdevelopmentToSubmit,
      { new: true, upsert: true }
    );
    returnObj.newdevelopment = newdevelopment;
  } catch (err) {
    console.log('Not Saved', err);
  }

  return returnObj;
};

const deleteNewDevelopment = async (obj, args, context, info) => {
  const { currentUser, res, req } = context;

  const { uuid } = args;

  const returnObj = {
    newdevelopmentID: uuid,
    error: null,
  };

  try {
    await NewDevelopment.deleteOne({ newdevelopmentID: uuid });
  } catch (err) {
    logger.log('error', err);
    returnObj.error = 'There was an error deleting the listing!';
  }
  return returnObj;
};

module.exports = { createNewDevelopment, deleteNewDevelopment };
