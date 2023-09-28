export function verifySchema(req, res, next, schema) {
    const supportedMethods = ["post", "put", "patch", "delete"];
    const method = req.method.toLowerCase()

    if (!supportedMethods.includes(method)) {
        throw `Unsupported method: ${method}!`
    }

    const validationOptions = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    };

    const { error, value } = schema.validate(req.body, validationOptions)
    if (error) {
        res.status(422)
        next(`Validation Error: ${error.details.map(x => x.message).join(', ')}`);
    } else {
        req.body = value;
        next()
    }
}