import express from 'express';
import { upload } from '../configs/multer.js';
import { protect } from '../middlewares/auth.js';
import { acceptConnectionRequest, dicoverUsers, followUser, getUserConnections, getUserData, sendConnectionRequest, unFollowUser, updateUserData } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', protect, getUserData);
userRouter.post('/update', upload.fields([{name: 'profile', maxCount: 1}, {name: 'cover', maxCount: 1}]) , protect, updateUserData);
userRouter.post('/discover', protect, dicoverUsers);
userRouter.post('/follow', protect, followUser);
userRouter.post('/unfollow', protect, unFollowUser);
userRouter.post('/connect', protect, sendConnectionRequest);
userRouter.post('/accept', protect, acceptConnectionRequest);
userRouter.get('/connections', protect, getUserConnections);

export default userRouter;