const User = require('../../../../../models/User');
const { logger } = require('../../../../../utils/logger');
const {
  returnViewableUserFields,
  returnAllUsersViewableFields,
} = require('../../../../../models/userRepository');

module.exports = {
  agents: async (obj, args, context) => {
    const { currentUser } = context;
    let agents;
    console.log("chechk the user datratt ", currentUser);
    try { 
      console.log("check the agents")
      if(currentUser && (currentUser.role == "admin" || currentUser.role == "super-admin")){
      agents = await User.find({ role: 'agent' }).exec();
      } else {
        agents = await User.find({$and:[{ role: 'agent' },{'agent.status': {$ne: "Suspended"}}]}).exec();
      }
    } catch (err) {
      logger.log('error', JSON.stringify(err));
      throw err;
    }
    return returnAllUsersViewableFields(currentUser, agents);
  },
  agent: async (obj, args, context) => {
    const { uuid } = args;
    const { currentUser, req } = context;
    let agent;

    console.log(`currentUser: ${currentUser}`);

    try {
      agent = await User.findByUUID(uuid);
    } catch (err) {
      logger.log('error', JSON.stringify(err));
      throw err;
    }

    if (agent) {
      console.log(agent);
      return returnViewableUserFields(currentUser, agent);
    }

    if (!agent) return null;
  },
};
