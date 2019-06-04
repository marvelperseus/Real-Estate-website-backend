const cleanUserInput = require('../../../../utils/cleanUserInput');
const generateRandomID = require('../../../../utils/idGenerator');
const { agent, admin, superAdmin } = require('../../../../constants/userTypes');
const throwUnautorizedAccessError = require('../../../../utils/throwUnauthorizedError');
const getSignedURLS = require('../../../../services/aws/s3/getSignedURLS');

const acceptedFilesRegex = new RegExp(/.(jpg)$|.(jpeg)$|.(png)$|.(gif)$/, 'i');

const getListingFileUploadsSignedURLS = async (obj, args, context, info) => {
  const { currentUser, req } = context;
  let listingID = generateRandomID();

  console.log('args', args);
  console.log(currentUser.role);

  if (args.input.listingID) {
    // eslint-disable-next-line prefer-destructuring
    listingID = args.input.listingID;
  }

  const returnObj = {
    listingID,
    items: null,
    error: null,
  };

  if (
    !currentUser ||
    !(
      currentUser.role === agent ||
      currentUser.role === admin ||
      currentUser.role === superAdmin
    )
  ) {
    throwUnautorizedAccessError(req, info);
  }

  const items = args.input.items.map(item => {
    const { fileName } = cleanUserInput(item);

    const url = `images/${listingID}/${fileName}`;

    return {
      itemName: item.itemName,
      fileType: item.fileType,
      uploadFilePath: url,
      fileName,
      expires: 300,
    };
  });

  items.forEach(item => {
    if (!acceptedFilesRegex.test(item.fileName)) {
      returnObj.error =
        'These file uploads must be in either PDF, JPG, or JPEG format!';
    }
  });

  returnObj.items = await getSignedURLS(items);

  return returnObj;
};

module.exports = getListingFileUploadsSignedURLS;
