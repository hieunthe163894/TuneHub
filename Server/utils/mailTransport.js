import nodeMailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "chuquyson123@gmail.com",
    pass: "hibgqwbhzpytuwtn",
  },
});
const sendMail = async (toEmail, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.USER,
      to: toEmail,
      subject: subject,
      text: text,
      html: html,
    });
    if (info && info.accepted.length > 0) {
      return {
        success: true,
        message: "Email sent successfully!",
      };
    }
    // throw new Error("Email sent unsuccessfully!");
  } catch (error) {
    console.log(error.message);
    // throw new Error(error.toString());
  }
};
const sendArtistKitPayment = async (email, artistName) => {
  try {
    console.log(email);
    const url = `${process.env.CLIENT_URI}artistKitPayment/${encodeURIComponent(
      artistName
    )}`;
    const mailres = await sendMail(
      email,
      "TuneHub - Your application for artist kit has been approved",
      "Almost there mate, just one more step and we are up and ready",
      `Click on the url and finish payment to active your artist account and start making some music today!!!! Payment url: ${url}`
    );
  } catch (error) {
    console.log(error.message);
  }
};

const sendArtistKitReject = async (email) => {
  try {
    const mailres = await sendMail(
      email,
      "TuneHub - Your application for artist kit has been rejected. You cann't become the artist",
    );
  } catch (error) {
    console.log(error.message);
  }
};
const sendConfirmEmail = async (email, userId) => {
  try {
    const confirmToken = jwt.sign(
      {
        userId: userId,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1hr",
      }
    );
    const url = `${process.env.CLIENT_URI}confirmSignUp/${confirmToken}`;
    const emailHtml =
      " <html  lang='en'>\n" +
      "  <head>\n" +
      "    <meta http-equiv='Content-Type'  content='text/html charset=UTF-8' />\n" +
      "    <title>Day 17/30</title>\n" +
      "    <style>\n" +
      "      body {\n" +
      "        background: #E57F94;\n" +
      "      }\n" +
      "      table {\n" +
      "        border-spacing: 0;\n" +
      "      }\n" +
      "      .main {\n" +
      "        margin: 0 auto;\n" +
      "      }\n" +
      "      .content-header {\n" +
      "        background: #E57F94;\n" +
      "      }\n" +
      "      .content-margin {\n" +
      "        padding: 20px 50px;\n" +
      "      }\n" +
      "      .content {\n" +
      "        width: 90%;\n" +
      "        margin: 0 auto;\n" +
      "      }\n" +
      "      .content-body {\n" +
      "        background: white;\n" +
      "        border-top: 8px solid #ff5e3a;\n" +
      "        border-radius: 5px 5px 0 0;\n" +
      "      }\n" +
      "      .content-footer {\n" +
      "        padding: 20px;\n" +
      "        background: black;\n" +
      "        border-radius: 0 0 5px 5px;\n" +
      "      }\n" +
      "      h1 {\n" +
      "        font-size: 27px;\n" +
      "      }\n" +
      "      .button-container {\n" +
      "        text-align: center;\n" +
      "      }\n" +
      "      .button {\n" +
      "        background-color: #ff5e3a;\n" +
      "        padding: 15px 32px;\n" +
      "        text-decoration: none;\n" +
      "        display: inline-block;\n" +
      "        border-radius: 5px;\n" +
      "        color: white !important;\n" +
      "        text-decoration: none;\n" +
      "        font-weight: 500;\n" +
      "      }\n" +
      "      .center {\n" +
      "        text-align: center;\n" +
      "      }\n" +
      "      a {\n" +
      "        color: black;\n" +
      "        text-decoration: none;\n" +
      "      }\n" +
      "      .copyright {\n" +
      "        background: #e9e9e9;\n" +
      "        font-size: 11px;\n" +
      "        color: grey;\n" +
      "        line-height: 5px;\n" +
      "      }\n" +
      "    </style>\n" +
      "  </head>\n" +
      "  <body>\n" +
      "    <body>\n" +
      "      <table role='presentation' class='main'>\n" +
      "        <tr>\n" +
      "          <td>\n" +
      "            <table role='presentation' class='content'>\n" +
      "              <tr>\n" +
      "                <td class='content-body content-margin'>\n" +
      "                  <table role='presentation'>\n" +
      "                    <h1>Confirm your TuneHub account</h1>\n" +
      "                    <p>Hi there,</p>\n" +
      "                    <p>\n" +
      "                      We are glad that you have choosen LucentChart to accompany you making your ideas reality. \uD83E\uDD1E\uD83D\uDE22\uD83E\uDD14,  Click on the link bellow to finish setting your account !!!\n" +
      "                    </p>\n" +
      "                    <p class='button-container'>\n" +
      "                      <a href='" +
      url +
      "                    ' class='button'>Activate your TuneHub account</a>\n" +
      "                    </p>\n" +
      "                    <p>We are thrilled to welcome you,<br />The LucentChart team</p>\n" +
      "                  </table>\n" +
      "                </td>\n" +
      "              </tr>\n" +
      "\n" +
      "              <tr>\n" +
      "                <td class='copyright'>\n" +
      "                  <table role='presentation'>\n" +
      "                    <tr>\n" +
      "                      <td>\n" +
      "                        <p>&copy; LucentChart<br /></p>\n" +
      "                      </td>\n" +
      "                    </tr>\n" +
      "                  </table>\n" +
      "                </td>\n" +
      "              </tr>\n" +
      "            </table>\n" +
      "          </td>\n" +
      "        </tr>\n" +
      "      </table>\n" +
      "    </body>\n" +
      "  </body>\n" +
      "</html>\n\n";
    const mailres = await sendMail(
      email,
      "LucentChart-Finish setting up you TuneHub account",
      "Almost there mate, just one more step and we are up and ready",
      emailHtml
    );
  } catch (error) {
    throw new Error(error.message);
  }
};
export { sendMail, transporter, sendConfirmEmail, sendArtistKitPayment, sendArtistKitReject };
