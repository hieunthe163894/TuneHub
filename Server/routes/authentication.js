import { AuthenticationController } from "../controller/index.js";
import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import passport from "passport";
import checkRole from "../middleware/authorization.js";
const authenticationRouter = express.Router();
authenticationRouter.post("/login", AuthenticationController.login);
authenticationRouter.post("/mobilelogin", AuthenticationController.mobileLogin);
authenticationRouter.get(
  "/user",
  verifyToken,
  AuthenticationController.getUserInfo
);
authenticationRouter.post("/signup", AuthenticationController.signUp);
authenticationRouter.patch(
  "/verify/:token",
  AuthenticationController.verifyUser
);
authenticationRouter.get(
  "/refreshToken",
  AuthenticationController.refreshToken
);
authenticationRouter.get("/logOut", AuthenticationController.logOut);
authenticationRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authenticationRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  AuthenticationController.oauth2GoogleAuthentication
);
authenticationRouter.post("/googleLogin", AuthenticationController.googleLogin);
authenticationRouter.post(
  "/forgot-password",
  AuthenticationController.sendResetLink
);

authenticationRouter.get(
  "/checkAdmin",
  verifyToken,
  checkRole('admin'),
  async (req, res) => {
    return res.status(200).json({ data: "User is Admin" });
  }
);

authenticationRouter.get(
  "/checkArtist",
  verifyToken,
  checkRole('artist'),
  async (req, res) => {
    return res.status(200).json({ data: "User is Artist" });
  }
);

authenticationRouter.get("/returnArtist/:userId", AuthenticationController.getArtistInfo);
export default authenticationRouter;
