const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.AUTH_user,
    pass: process.env.AUTH_pass,
  },
});

//When the user is created this funciton will run
const welcomeEmail = async (email, name) => {
  const mailOptions = {
    from: "faisalkhanisrar@gmail.com",
    to: email,
    subject: "Thanks for joining in!",
    text: `Welcome to the app, ${name}`,
  };
  // send mail with defined transport object
  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
};

const cancelEmail = async (email , name) =>{
    const mailOptions = {
        from:"faisalkhanisrar@gmail.com",
        to : email,
        subject: "Sorry to see you go.",
        text:  `Why you delete your account ,Mr. ${name} ,If you have any query plz mail us.`
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s " , info.messageId);
}

module.exports = {
  welcomeEmail,
  cancelEmail,
};
