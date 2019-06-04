const registerCustomer = require('./customers/registerCustomer');
const logoutUser = require('./shared/logoutUser');
const loginUser = require('./shared/loginUser');
const getProfilePicSignedURL = require('./shared/getProfilePicSignedURL');
const createAgent = require('./agents/createAgent');
const updateAgent = require('./agents/updateAgent');
const deleteAgent = require('./agents/deleteAgent');
const messageAgent = require('./agents/messageAgent');
const editAgentPassword = require('./agents/editAgentPassword');
const blockAgent = require('./agents/blockAgent')
const createAdmin = require('./admin/createAdmin');
const updateAdmin = require('./admin/updateAdmin');
const deleteAdmin = require('./admin/deleteAdmin');
const editAdminPassword = require('./admin/editAdminPassword');
const setAgentProfilePic = require('./agents/setAgentProfilePic');
const userForgotPassword = require('./shared/userForgotPassword');
const resetPassword = require('./shared/resetPassword');

module.exports = {
  registerCustomer,
  logoutUser,
  getProfilePicSignedURL,
  loginUser,
  createAgent,
  editAgentPassword,
  blockAgent,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  messageAgent,
  updateAgent,
  deleteAgent,
  editAdminPassword,
  setAgentProfilePic,
  userForgotPassword,
  resetPassword,
};
