import {Router} from "express";
import {serverHealthCheck} from "../controllers/server-utils.controller.js";

const serverUtilsRouter = Router()

serverUtilsRouter.get("/api/healthCheck", serverHealthCheck)

export default serverUtilsRouter