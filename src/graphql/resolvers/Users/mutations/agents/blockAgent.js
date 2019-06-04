const User = require('../../../../../models/User');
const { logger } = require('../../../../../utils/logger');
const {
  agent: agentRole,
  admin,
  superAdmin,
} = require('../../../../../constants/userTypes');
const throwUnautorizedAccessError = require('../../../../../utils/throwUnauthorizedError');

async function blockAgent(obj, args, context, info) {
  const { currentUser, res, req } = context;

  const { uuid , status} = args.input;
console.log("check the user ",JSON.stringify(status), " agentId ", uuid);
  if (
    !currentUser ||
    (currentUser.role !== admin &&
      currentUser.role !== superAdmin &&
      currentUser.role !== agentRole)
  ) {
    throwUnautorizedAccessError(req, info);
  }

  if (currentUser.role === agentRole && currentUser.uuid !== uuid) {
    throwUnautorizedAccessError(req, info);
  }

  const blockAgentReturn = {
    userErrors: [],
    otherError: null,
  };

  let agent;

  // TODO: perform server-side validations on user inputs

  try {
    agent = await User.findByUUID(uuid);
  } catch (err) {
    blockAgentReturn.error = err;
    logger.log('error', err);
    return blockAgentReturn;
  }

  console.log("Befpore   The agent that you are attmpting to edit cannot be");
  if (!agent) {
    blockAgentReturn.error =
      'The agent that you are attmpting to edit cannot be found.';
    return blockAgentReturn;
  } else {
      agent.agent.status = status;
  }
console.log(JSON.stringify(status), "After   The agent that you are attmpting to edit cannot be",agent);
  try {
    var newAgent = await User.findOneAndUpdate({"uuid": uuid},{"agent.status":status},{new: true});
    console.log("After  success ocured  >>>>>>>>>>> ",newAgent);

  } catch (err) {
    if (err.custom && err.type === 'Normal') {
      if (err.errors) {
        console.log(err);
        Object.keys(err.errors).forEach(key => {
            blockAgentReturn.userErrors.push({
            field: key,
            message: err.errors[key],
          });
        });
      }
      return blockAgentReturn;
    }
    blockAgentReturn.otherError = err;
    logger.log('error', err);
    return blockAgentReturn;
  }

  console.log(blockAgentReturn);

  return blockAgentReturn;
}

module.exports = blockAgent;
