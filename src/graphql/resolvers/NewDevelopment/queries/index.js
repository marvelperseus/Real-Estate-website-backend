const NewDevelopment = require('../../../../models/NewDevelopment');
const Listing = require('../../../../models/Listing');
const User = require('../../../../models/User');
const { logger } = require('../../../../utils/logger');
const { superAdmin, admin, agent } = require('../../../../constants/userTypes');
const throwUnautorizedAccessError = require('../../../../utils/throwUnauthorizedError');

const PAGE_LENGTH = 5;

module.exports = {
  newdevelopmentViewQuery: async (obj, args, context, info) => {
    const { uuid: newdevelopmentID } = args;
    let newdevelopment, agents;

    try {
      newdevelopment = await NewDevelopment.findByNewdevelopmentID(
        newdevelopmentID
      );
      agents =
        (await User.find({ uuid: { $in: newdevelopment.agents } })) || [];
      listings =
        (await Listing.find({ address: newdevelopment.address })) || [];
    } catch (err) {
      console.log(err);
      logger.log('error', JSON.stringify(err));
      throw err;
    }

    return { newdevelopment, agents, listings };
  },

  newdevelopmentFormView: async (obj, args, context, info) => {
    const { uuid: newdevelopmentID } = args;
    let newdevelopment;

    try {
      newdevelopment = await NewDevelopment.findByNewdevelopmentID(
        newdevelopmentID
      );
    } catch (err) {
      console.log(err);
      logger.log('error', JSON.stringify(err));
      throw err;
    }

    return newdevelopment;
  },

  newdevelopments: async (obj, args, context, info) => {
    let newdevelopments = [];
    try {
      newdevelopments = await NewDevelopment.find();
    } catch (err) {
      console.log(err);
      logger.log('error', JSON.stringify(err));
      throw err;
    }

    return newdevelopments;
  },
};
