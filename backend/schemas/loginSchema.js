import Joi from "joi";
import { verifySchema } from "../middleware/verifySchema.js";

export function loginSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    })

    verifySchema(req, res, next, schema)
}