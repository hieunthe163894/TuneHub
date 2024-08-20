import express from 'express';
import { UserController } from '../controller/index.js';
import verifyToken from "../middleware/verifyToken.js";
import checkRole from '../middleware/authorization.js';

const userRouter = express.Router();

userRouter.put('/change-password', verifyToken, UserController.changePassword);
userRouter.put('/edit-profile', UserController.editProfile);
userRouter.post('/follow', verifyToken, UserController.followArtist);
userRouter.get('/checkFollowed/:artistId', UserController.checkArtistFollowed);
userRouter.get('/artistFollowed', verifyToken, UserController.getListArtistFollowed);
userRouter.get('/listPlayList', verifyToken, UserController.getListPlayList);
userRouter.get('/favouritedSong', verifyToken, UserController.getListFavouritedSong);
userRouter.get('/StreamSong', verifyToken, UserController.getStreamSong);
userRouter.get('/getAllUser', verifyToken, checkRole("admin"), UserController.getAllUser);
userRouter.put('/banAccount/:id', verifyToken, checkRole("admin"), UserController.banAccount);  

export default userRouter;