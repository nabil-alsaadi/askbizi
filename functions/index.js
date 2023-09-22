const functions = require("firebase-functions");
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
admin.initializeApp();

/**
* Here we're using Gmail to send 
*/
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'malek@askbizi.com',
        pass: 'uvscmyizpntuowxb'
    }
});

exports.inquiryEmail = functions.firestore
    .document('inquiries/{inquiryId}')
    .onCreate((snap, context) => {
      // Get an object representing the document
      const newValue = snap.data();
      //const name = newValue.name;
      const dest = "askbizi@askbizi.com";

      const mailOptions = {
          from: 'ASK BIZI INQUIRY <malek@askbizi.com>', // Something like: Jane Doe <janedoe@gmail.com>
          to: dest,
          subject: `ASK BIZI INQUIRY ${newValue.name}`, // email subject
        //   html: `<h2 style="font-size: 16px;">ASK BIZI INQUIRY</h2>
        //       <br />
        //       <h4>name: ${newValue.name}</h4>
        //       <h4>email: ${newValue.email}</h4>
        //       <h4>phone: ${newValue.phone}</h4>
        //       <h4>service: ${newValue.service}</h4>
        //       <h4>notes: ${newValue.note}</h4>
        //   ` // email content in HTML
        html: `<div style="text-align: center;">
        <img src="https://askbizitest-f0039.web.app/assets/img/logo1.png" alt="..." style="object-fit: contain; margin-bottom: 40px; width:200px;">
      <h1 style="text-align: center;">ASK BIZI INQUIRY</h1>
      
      <table class="gmail-table" style="width: 100%;border: solid 2px #000;border-collapse: collapse;border-spacing: 0;font: normal 14px Roboto, sans-serif;">
        <thead>
          <tr>
            <th style="width:30%; background-color: #b11c3d;
            border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-align: left;">Field</th>
            <th style="background-color: #b11c3d;
            border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-align: left;">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style=" border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-shadow: 1px 1px 1px #fff;">Name</td>
            <td style=" border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-shadow: 1px 1px 1px #fff;">${newValue.name}</td>
          </tr>
          <tr>
            <td style=" border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-shadow: 1px 1px 1px #fff;">Email</td>
            <td style=" border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-shadow: 1px 1px 1px #fff;">${newValue.email}</td>
          </tr>
          <tr>
            <td style=" border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-shadow: 1px 1px 1px #fff;">Phone</td>
            <td style=" border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-shadow: 1px 1px 1px #fff;">${newValue.phone}</td>
          </tr>
          <tr>
            <td style=" border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-shadow: 1px 1px 1px #fff;">Service</td>
            <td style=" border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-shadow: 1px 1px 1px #fff;">${newValue.service}</td>
          </tr>
          <tr>
            <td style=" border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-shadow: 1px 1px 1px #fff;">Notes</td>
            <td style=" border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-shadow: 1px 1px 1px #fff;">${newValue.note}</td>
          </tr>
          
        </tbody>
      </table>
      </div>
      `
      };

      // returning result
      return transporter.sendMail(mailOptions, (erro, info) => {
          if(erro){
              return res.send(erro.toString());
          }
          return res.send('Sended');
      });
      // perform desired operations ...
    });



exports.contactEmail = functions.firestore
    .document('contact/{contactId}')
    .onCreate((snap, context) => {
      // Get an object representing the document
      const newValue = snap.data();
      //const name = newValue.name;
      const dest = "askbizi@askbizi.com";

      const mailOptions = {
          from: 'ASK BIZI CONTACT <askbizi@askbizi.com>', // Something like: Jane Doe <janedoe@gmail.com>
          to: dest,
          subject: `ASK BIZI CONTACT ${newValue.name}`, // email subject
        //   html: `<h2 style="font-size: 16px;">ASK BIZI INQUIRY</h2>
        //       <br />
        //       <h4>name: ${newValue.name}</h4>
        //       <h4>email: ${newValue.email}</h4>
        //       <h4>phone: ${newValue.phone}</h4>
        //       <h4>message: ${newValue.message}</h4>
        //   ` // email content in HTML
        html: `<div style="text-align: center;">
        <img src="https://askbizitest-f0039.web.app/assets/img/logo1.png" alt="..." style="object-fit: contain; margin-bottom: 40px; width:200px;">
      <h1 style="text-align: center;">ASK BIZI CONTACT</h1>
      
      <table class="gmail-table" style="width: 100%;border: solid 2px #000;border-collapse: collapse;border-spacing: 0;font: normal 14px Roboto, sans-serif;">
        <thead>
          <tr>
            <th style="width:30%; background-color: #b11c3d;
            border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-align: left;">Field</th>
            <th style="background-color: #b11c3d;
            border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-align: left;">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style=" border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-shadow: 1px 1px 1px #fff;">Name</td>
            <td style=" border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-shadow: 1px 1px 1px #fff;">${newValue.name}</td>
          </tr>
          <tr>
            <td style=" border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-shadow: 1px 1px 1px #fff;">Email</td>
            <td style=" border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-shadow: 1px 1px 1px #fff;">${newValue.email}</td>
          </tr>
          <tr>
            <td style=" border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-shadow: 1px 1px 1px #fff;">Phone</td>
            <td style=" border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-shadow: 1px 1px 1px #fff;">${newValue.phone}</td>
          </tr>
          <tr>
            <td style=" border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-shadow: 1px 1px 1px #fff;">Message</td>
            <td style=" border: solid 1px #000;
            color: #000;
            padding: 10px;
            text-shadow: 1px 1px 1px #fff;">${newValue.message}</td>
          </tr>
          
        </tbody>
      </table>
      </div>
      `
      };

      // returning result
      return transporter.sendMail(mailOptions, (erro, info) => {
          if(erro){
              return res.send(erro.toString());
          }
          return res.send('Sended');
      });
      // perform desired operations ...
    });



exports.sendMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      
        // getting dest email by query string
        const dest = req.query.dest;

        const mailOptions = {
            from: 'Your ASKBIZI <nabil.atechytechnologies@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
            to: dest,
            subject: 'I\'M A PICKLE!!!', // email subject
            html: `<p style="font-size: 16px;">Pickle Riiiiiiiiiiiiiiiick!!</p>
                <br />
                <img src="https://images.prod.meredith.com/product/fc8754735c8a9b4aebb786278e7265a5/1538025388228/l/rick-and-morty-pickle-rick-sticker" />
            ` // email content in HTML
        };
  
        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if(erro){
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });    
});
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
