import Joi from "joi";
import { verifySchema } from "../middleware/verifySchema.js";

const PASSWORD_REGEX = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
);

export const signupSchema = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email().required(),
        role: Joi.string().valid('user'),
        password: Joi.string().pattern(PASSWORD_REGEX).min(8).required()
    })

    verifySchema(req, res, next, schema)
}