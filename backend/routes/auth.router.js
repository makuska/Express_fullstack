import * as authController from '../controllers/auth.controller.js'
import * as userController from '../controllers/user.controller.js'
import { checkDuplicateUsernameOrEmail } from '../middleware/verifySignup.js'
import {Router} from "express";
import {signupSchema} from "../schemas/signupSchema.js";
import {loginSchema} from "../schemas/loginSchema.js";
import {checkRole, verifyToken} from "../middleware/authJWT.js";

const authRoute = Router()

authRoute.post('/api/auth/signup', [signupSchema, checkDuplicateUsernameOrEmail], authController.signup)
authRoute.post('/api/auth/signin', loginSchema, authController.login)
authRoute.get('/isAdmin', [verifyToken, checkRole('admin')], authController.sampleAdminEvent)
authRoute.get('/isUser', [verifyToken, checkRole('user')], authController.sampleUserEvent)
authRoute.delete('/api/auth/logout', authController.logout)
authRoute.get('/api/auth/verifyRefreshToken', authController.verifyRefreshToken)
authRoute.get('/api/user/:userId', userController.getUserDetailsById)

export default authRoute;