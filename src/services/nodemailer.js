const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const exphbs = require('express-handlebars');
const path = require('path');
const pdf = require('html-pdf');

const handlebarsEngineInstance = exphbs.create({    partialsDir: __dirname + 'emailViews/partials/'});
const handlebarsOptions = {
  viewEngine: handlebarsEngineInstance,
  viewPath: path.join(__dirname, '..', 'emailViews'),
  partialsDir: path.join(__dirname, '..', 'emailViews/partials/'),
};

const text_transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: "no-reply@reyeselsamad.com",
    clientId: '298265608299-od0ccv9erhp7k7vbj4gd8u57881143me.apps.googleusercontent.com',
    clientSecret: 'QlQoeJMj_zh1krT93DlJyAoc',
    refreshToken: '1/GZImjkNEYPG26jYm9LCZ2dN7Pm1NJfUgzMOkciE6uus',
  },
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: "no-reply@reyeselsamad.com",//process.env.EMAIL_USERNAME,
    clientId: '298265608299-od0ccv9erhp7k7vbj4gd8u57881143me.apps.googleusercontent.com',//process.env.GMAIL_CLIENT_ID,
    clientSecret: 'QlQoeJMj_zh1krT93DlJyAoc',//process.env.GMAIL_CLIENT_SECRET,
    refreshToken: '1/GZImjkNEYPG26jYm9LCZ2dN7Pm1NJfUgzMOkciE6uus'//process.env.GMAIL_REFRESH_TOKEN,
  },
});

transporter.use('compile', hbs(handlebarsOptions));

const sendOne = ({ from, to, subject, template, templateArgs, text, attachments = [] }) => {
  console.log('==============', template);
  console.log(text);
  if (text) {
    const mail = {
      from,
      to,
      subject,
      text,
      attachments,
    };
    text_transporter.sendMail(mail).then(res => {
      console.log(res);
      return res;
    });
  } else {
    if (template === 'invoice-submission-invoicee-version') {
      handlebarsEngineInstance
        .render(
          path.join(__dirname, '..', 'emailViews/' + template + '.handlebars'),
          templateArgs
        )
        .then(html => {
          console.log('check html parser ', html);
          pdf.create(html).toBuffer(function(err, buffer) {
            const mail = {
              from: from || process.env.EMAIL_USERNAME,
              to,
              subject,
              template,
              context: templateArgs,
              attachments: [
                {
                  filename: `invoice.pdf`,
                  content: buffer,
                  encoding: 'base64',
                  contentType: 'application/pdf',
                },
              ],
            };
            transporter.sendMail(mail).then(res => {
              console.log(res);
              return res;
            });
          });
        });
    } else {
      const mail = {
        from: from || 'no-reply@reyeselsamad.com',
        to: to,
        subject,
        template: template,
        context: templateArgs,
      };

      transporter.sendMail(mail).then(res => {
        console.log('erroed response ', res);
        return res;
      });
    }
  }
};

module.exports = {
  sendOne,
};
