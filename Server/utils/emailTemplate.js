import nodemailer from "nodemailer";

const sendNewPasswordEmail = async (email, newPassword) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "chuquyson123@gmail.com",
      pass: "hibgqwbhzpytuwtn",
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "New Password",
    html: `
        <div style="display:flex;justify-content:center;margin-left:20em;">
        <div>
            <div style="background-color: #ff5e3a;border-radius: 10px 10px 0 0; padding: 5px;"></div>
            <div style="background-color: #fff; padding: 10px;">
                <h2 style="text-align:center">New password your TuneHub account</h2>
                <p>Hello,</p>
                <p>Your new password for your account is: <strong>${newPassword}</strong></p>
                <p>Please use this password to log in and consider changing it to a more secure one.</p>
                
                <button style="border:none;border-radius: 5px;padding:5px 10px;margin-left:13em;background-color: #ff5e3a;color:white; text-align: center;cursor:pointer"><p style="margin:0">Click <a href="http://localhost:3000/login" style="text-decoration-line: none;color:white;">here</a> to login.</p></div>
                </button>

            <div style="background-color: #ccc; padding: 2px;">
                <p style="text-align: center;font-size:10px;margin:0">© TuneHub</p>
            </div>
        </div>
    </div>
        `,
  };

  await transporter.sendMail(mailOptions);
};

export default { sendNewPasswordEmail };
