import * as authController from '../controllers/auth.controller.js'
import * as userController from '../controllers/user.controller.js'
import { checkDuplicateUsernameOrEmail } from '../middleware/verifySignup.mjs'
import {Router} from "express";
import {signupSchema} from "../schemas/signupSchema.js";
import {loginSchema} from "../schemas/loginSchema.js";
import {isAdmin, isUser, verifyToken} from "../middleware/authJWT.mjs";

const userRoute = Router()

userRoute.post('/api/auth/signup', [signupSchema, checkDuplicateUsernameOrEmail], authController.signup)
userRoute.post('/api/auth/signin', loginSchema, authController.login)
userRoute.get('/isAdmin', [verifyToken, isAdmin], authController.sampleAdminEvent)
userRoute.get('/isUser', [verifyToken, isUser], authController.sampleUserEvent)
userRoute.delete('/api/auth/logout', authController.logout)
userRoute.get('/api/auth/verifyRefreshToken', authController.verifyRefreshToken)
userRoute.get('/api/user/:userId', userController.getUserDetailsById)

export default userRoute;