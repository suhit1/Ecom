/**
 *
 * Run:
 *
 */
const mailjet = require("node-mailjet").connect(
  "c2b82f8d366f9d0508355448ab88155b",
  "05ad5760ed552010ee8345b8d8e2a208"
);

module.exports = (email_id, name, link, whattodo, callback) => {
  // if we want to verify email only
  if (whattodo === "verification") {
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "suhitgupta111@gmail.com",
            Name: "Suhit Gupta",
          },
          To: [
            {
              Email: email_id,
              Name: name,
            },
          ],
          Subject: "PLz Verify Your Account",
          TextPart: "Greetings from Suhit!",
          HTMLPart: `Hi <b>${name}</b> Hope you are doing Well!
                      <br/>
                   Copy this link and paste it in your browser ${link}  to Verify your account
                   <br/>
                   If this link does not open copy this link and paste it in the browser
                   `,
        },
      ],
    });
    request
      .then((result) => {
        callback(null, result.body);
      })
      .catch((err) => {
        callback(err, null);
      });
  } else if (whattodo === "forgotpassword") {
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "suhitgupta111@gmail.com",
            Name: "Suhit Gupta",
          },
          To: [
            {
              Email: email_id,
              Name: name,
            },
          ],
          Subject: "PLz Verify Your Account",
          TextPart: "Greetings from Suhit!",
          HTMLPart: `Welcome dear <b>${name}</b> Hope you are doing Well!
                      <br/>
                   Copy This link And paste it in your browser ${link} to reset Your Password
                   <br/>
                   If this link does not open copy this link and paste it in the browser
                   `,
        },
      ],
    });
    request
      .then((result) => {
        callback();
      })
      .catch((err) => {
        callback(err);
      });
  }
};
