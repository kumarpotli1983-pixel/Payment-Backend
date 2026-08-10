import nodemailer from "nodemailer"
import { asyncHandler } from "../utils/asyncHandler";

const transporter = nodemailer.createTransport({
  service:'gmail',
  auth:{
    type :'0Auth2',
    user : process.env.USER_EMAIL,
    clientId : process.env.CLIENT_ID,
    clientSecret : process.env.CLIENT_SECRET,
    refreshToken : process.env.REFRESH_TOKEN
  }
});

try {
  await transporter.verify();
  console.log("server is ready to take our messages");
} catch (err) {
  console.log("Transporter Verification failed : ",err)
}

const sendEmail = async(to, subject, text, html)=>{
  try {
    const info = await transporter.sendEmail({
      from:`"Payment-Backend" <${process.env.USER_EMAIL}>`,
      to,
      subject,
      text,
      html,
    })

    console.log('Message sent: %s',info.messageId)
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))

  } catch (error) {
    console.error("Error while sending mail:", err)
  }
}

async function sendRegistrationEmail(userEmail,name){
  const subject = 'Welcome to Payment-Backend!'
  const text = `Hello ${name},

  Thank you for registering at Payment-Backend.

  We're excited to have you on board!

  Best regards,
  The Payment-Backend Team`

  const html = `
  <p>Hello ${name},</p>
  <p>
      Thank you for registering at <strong>Payment-Backend</strong>.
      We're excited to have you on board!
  </p>
  <p>
      Best regards,<br>
      <strong>The Payment-Backend Team</strong>
  </p>
`
await sendEmail(userEmail, subject, text, html)
}

export default sendRegistrationEmail;
