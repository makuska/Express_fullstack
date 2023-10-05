import * as authController from '../controllers/auth.controller.js'
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
userRoute.post('/api/auth/newToken', authController.getNewAccessToken)
userRoute.delete('api/auth/logout', authController.logout)

export default userRoute;