import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service:'gmail',
  auth:{
    type :'OAuth2',
    user : process.env.USER_EMAIL,
    clientId : process.env.CLIENT_ID,
    clientSecret : process.env.CLIENT_SECRET,
    refreshToken : process.env.REFRESH_TOKEN
  }
});


try {
  await transporter.verify();
  console.log("server is ready to take our email messages");
} catch (err) {
  console.log("Transporter Verification failed : ",err)
}

const sendEmail = async(to, subject, text, html)=>{
  try {
    
    const info = await transporter.sendMail({
      from:`"Payment-Backend" <${process.env.USER_EMAIL}>`,
      to,
      subject,
      text,
      html,
    })

    console.log('Message sent: %s',info.messageId)
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))

  } catch (error) {
    console.error("Error while sending mail:", error)
    throw error
  }
}

async function sendRegistrationEmail(userEmail,name){
  const subject = 'Welcome to Payment-Backend!'
  const text = `Hello ${name},

  Thank you for registering at Payment-Backend.

  We're excited to have you on board!

  This service is provided by Enosh

  Best regards,
  Enosh,
  The Payment-Backend Team`

  const html = `
  <p>Hello ${name},</p>
  <p>
      Thank you for registering at <strong>Payment-Backend</strong>.
      We're excited to have you on board!
  </p>
  <p>
    This service is provided by <strong>Enosh<strong>
  </p>
  <p>
      Best regards,<br>
      <strong>Enosh<strong>,<br>
      <strong>The Payment-Backend Team</strong>
  </p>
`
  await sendEmail(userEmail, subject, text, html)
}

async function sendTransactionEmail(userEmail, name, amount, toAccount, transactionId) {

    const subject = "Transaction Successful";

    const text = `
      Hello ${name},

      Your transaction was successful.

      Transaction Details:
      Amount: ₹${amount}
      To Account: ${toAccount}
      TransactionId: ${transactionId}

      The amount has been successfully transferred.

      If you did not authorize this transaction, please contact our support team immediately.

      Best regards,
      Payment-Backend Team
      `
    const html = `
      <h2>Transaction Successful</h2>

      <p>Hello ${name},</p>

      <p>Your transaction has been successfully completed.</p>

      <p>
          <strong>Amount:</strong> ₹${amount}<br>
          <strong>To Account:</strong> ${toAccount}
          <strong>Amount:</strong> ${transactionId}
      </p>

      <p>
          If you did not authorize this transaction, please contact our
          support team immediately.
      </p>

      <p>
          Best regards,<br>
          <strong>Payment-Backend Team</strong>
      </p>
  `;

  await sendEmail(userEmail, subject, text, html)
    
}

async function sendTransactionFailedEmail (userEmail, name, amount, toAccount, transactionId){

  const subject = 'Transaction Failed'

  const text = `
    Hello ${name},

    Unfortunately, your transaction could not be completed.

    Transaction Details:
    Amount: ₹${amount}
    To Account: ${toAccount}
    Transaction ID: ${transactionId}
    Status: Failed

    No amount has been successfully transferred.

    If you believe this is an error, please contact our support team with the transaction ID mentioned above.

    Best regards,
    Payment-Backend Team
    `
  
  const html = `
    <h2>Transaction Failed</h2>

    <p>Hello ${name},</p>

    <p>
        Unfortunately, your transaction could not be completed.
    </p>

    <p>
        <strong>Amount:</strong> ₹${amount}<br>
        <strong>To Account:</strong> ${toAccount}<br>
        <strong>Transaction ID:</strong> ${transactionId}<br>
        <strong>Status:</strong> Failed
    </p>

    <p>
        No amount has been successfully transferred.
    </p>

    <p>
        If you believe this is an error, please contact our
        support team with the transaction ID mentioned above.
    </p>

    <p>
        Best regards,<br>
        <strong>Payment-Backend Team</strong>
    </p>
    `

    await sendEmail(userEmail, subject, text, html)
}

export {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailedEmail
}
