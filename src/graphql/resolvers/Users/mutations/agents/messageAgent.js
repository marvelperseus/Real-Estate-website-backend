const { sendOne } = require('../../../../../services/nodemailer');

async function messageAgent(obj, args, context, info) {
  const { from, to, name, phone, subject, text } = args.input;
  sendOne({ from, to, name, phone, subject, text });
  return { result: true };
}

module.exports = messageAgent;
