const router = require('express').Router();
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const bodyParser = require('body-parser');
const schema = require('../graphql');
const authenticate = require('../customMiddleware/auth');
const { sendOne } = require('../services/nodemailer');
var multer = require('multer');
var upload = multer({ dest: '/tmp' });
// const usersRouter = require('./users');
// const sessionRouter = require('./session');

const myGraphQLSchema = schema;

const graphQLOptionsFunc = (req, res) => ({
  schema: myGraphQLSchema,
  context: {
    currentUser: req.user,
    req,
    res,
  },
  tracing: true,
  cacheControl: true,
});

router.post(
  '/graphql',
  authenticate,
  bodyParser.json(),
  graphqlExpress(graphQLOptionsFunc)
);

router.post('/career', upload.single('attachment'), function(req, res, next) {
  const {first, last, phone, available, company} = req.body;
  sendOne({
    to: 'Admin@reyeselsamad.com',
    from: req.body.email,
    text: `Email: ${req.body.email}\nFrom: ${first} ${last}\nPhone: ${phone}\nPosition: ${available}\nCompany: ${company}`,
    subject: 'Career',
    attachments: req.file && [{ path: req.file.path, filename: req.file.originalname }],
  });
  res.end();
});

// graphiql
if (process.env.NODE_ENV !== 'production') {
  router.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
}

router.use('/', (req, res) => {
  res.status(200).send('<h1 style="text-align: center">Nothing Here...</h1>');
});

module.exports = router;
